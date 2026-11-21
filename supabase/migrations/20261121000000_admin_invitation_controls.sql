ALTER TABLE weddings
    ADD COLUMN IF NOT EXISTS show_guest_max_attendees BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE events
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

CREATE OR REPLACE FUNCTION public.admin_update_guest(
    p_guest_id UUID,
    p_display_name TEXT,
    p_phone TEXT,
    p_max_attendees INTEGER,
    p_notes TEXT,
    p_event_ids UUID[]
)
RETURNS public.guests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    wedding_id_value UUID;
    updated_guest public.guests;
    matching_event_count INTEGER;
BEGIN
    IF p_max_attendees < 1 OR p_max_attendees > 50 THEN
        RAISE EXCEPTION 'Invalid attendee limit';
    END IF;

    SELECT wedding_id
    INTO wedding_id_value
    FROM public.guests
    WHERE id = p_guest_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Guest not found';
    END IF;

    IF COALESCE(cardinality(p_event_ids), 0) = 0 THEN
        RAISE EXCEPTION 'At least one event is required';
    END IF;

    SELECT COUNT(*)
    INTO matching_event_count
    FROM public.events
    WHERE id = ANY(p_event_ids)
      AND wedding_id = wedding_id_value
      AND is_active = TRUE;

    IF matching_event_count <> cardinality(p_event_ids) THEN
        RAISE EXCEPTION 'Invalid event selection';
    END IF;

    UPDATE public.guests
    SET display_name = p_display_name,
        phone = p_phone,
        max_attendees = p_max_attendees,
        notes = p_notes,
        updated_at = NOW()
    WHERE id = p_guest_id
    RETURNING * INTO updated_guest;

    DELETE FROM public.guest_event_access
    WHERE guest_id = p_guest_id;

    INSERT INTO public.guest_event_access (guest_id, event_id, max_attendees)
    SELECT p_guest_id, selected_event.event_id, p_max_attendees
    FROM unnest(p_event_ids) AS selected_event(event_id);

    RETURN updated_guest;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_guest(UUID, TEXT, TEXT, INTEGER, TEXT, UUID[])
    FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_guest(UUID, TEXT, TEXT, INTEGER, TEXT, UUID[])
    TO service_role;
