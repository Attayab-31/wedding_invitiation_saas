import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { generateGuestToken, hashGuestToken, timingSafeEqualHash } from '../src/lib/security/token.js';
import { normalizePakistaniPhone } from '../src/lib/security/phone.js';
import { DatabaseService } from '../src/lib/data/db-service.js';

console.log('--- RUNNING WEDDING INVITATION PLATFORM TEST SUITE ---\n');

async function runTests() {
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}:`, err.message);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}:`, err.message);
    }
  }

  // 1. Token Security Tests
  test('Token Generation: Generates tokens with >= 128 bits entropy', () => {
    const t1 = generateGuestToken();
    const t2 = generateGuestToken();
    assert.ok(t1.length >= 32, 'Token length should be at least 32 characters');
    assert.notStrictEqual(t1, t2, 'Tokens must be uniquely random');
  });

  test('Token Hashing: SHA-256 produces deterministic 64-char hex digest', () => {
    const raw = 'test-guest-token-123';
    const h1 = hashGuestToken(raw);
    const h2 = hashGuestToken(raw);
    assert.strictEqual(h1.length, 64);
    assert.strictEqual(h1, h2);
    assert.ok(timingSafeEqualHash(h1, h2));
    assert.ok(!timingSafeEqualHash(h1, '0000000000000000000000000000000000000000000000000000000000000000'));
  });

  // 2. Pakistani Phone Normalization Tests
  test('Phone Normalizer: Handles local 03XX format', () => {
    const res = normalizePakistaniPhone('03001234567');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.normalized, '923001234567');
    assert.strictEqual(res.formattedDisplay, '+92 300 1234567');
  });

  test('Phone Normalizer: Handles +92 and dashes', () => {
    const res = normalizePakistaniPhone('+92 300-1234567');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.normalized, '923001234567');
  });

  test('Phone Normalizer: Rejects invalid length or non-Pakistani prefix', () => {
    const res1 = normalizePakistaniPhone('12345');
    assert.strictEqual(res1.isValid, false);

    const res2 = normalizePakistaniPhone('+14155552671');
    assert.strictEqual(res2.isValid, false);
  });

  // 3. Guest Token Resolution & Multi-Event Permissions
  await asyncTest('Guest Resolution: Guest 1 (Bilal Ahmed) receives Mehndi & Barat only', async () => {
    const exp = await DatabaseService.resolveGuestByToken('vip-bilal-ahmed-family');
    assert.ok(exp, 'Guest should resolve successfully');
    assert.strictEqual(exp.guest.display_name, 'Bilal Ahmed & Family');
    assert.strictEqual(exp.events.length, 2);

    const eventTypes = exp.events.map((e) => e.event_type);
    assert.ok(eventTypes.includes('mehndi'), 'Must include Mehndi');
    assert.ok(eventTypes.includes('barat'), 'Must include Barat');
    assert.ok(!eventTypes.includes('walima'), 'Must NOT include Walima (unauthorized)');
    assert.ok(!('max_attendees' in exp.guest), 'Invitation payload should not expose attendee limits');
    assert.ok(exp.events.every((event) => !('guest_max_attendees' in event) && !('existing_rsvp' in event)));
  });

  await asyncTest('Guest Resolution: Guest 2 (Muhammad Ali) receives Barat only', async () => {
    const exp = await DatabaseService.resolveGuestByToken('guest-muhammad-ali');
    assert.ok(exp);
    assert.strictEqual(exp.guest.display_name, 'Mr. Muhammad Ali');
    assert.strictEqual(exp.events.length, 1);
    assert.strictEqual(exp.events[0].event_type, 'barat');
  });

  await asyncTest('Guest Resolution: Guest 3 (Usman Khan) receives all 3 events', async () => {
    const exp = await DatabaseService.resolveGuestByToken('guest-chaudhry-usman');
    assert.ok(exp);
    assert.strictEqual(exp.events.length, 3);
  });

  await asyncTest('Security: Invalid or revoked tokens return null', async () => {
    const invalid = await DatabaseService.resolveGuestByToken('completely-fake-token-xyz');
    assert.strictEqual(invalid, null);
  });

  // 4. GLB Asset Verification
  test('Asset Verification: GLB model exists and is non-empty', () => {
    const glbPath = path.resolve('public/models/luxury_envelope.glb');
    assert.ok(fs.existsSync(glbPath), 'luxury_envelope.glb must exist in public/models');
    const stats = fs.statSync(glbPath);
    assert.ok(stats.size > 20000, 'luxury_envelope.glb size must exceed 20KB');
  });

  console.log(`\n==========================================`);
  console.log(`TEST SUITE RESULTS: ${passed} / ${total} TESTS PASSED`);
  console.log(`==========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
