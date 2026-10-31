function generateCalendarLinks({ title, description, location, startDate, endDate }) {
    const safeDate = (input) => {
        const date = new Date(input);
        if (isNaN(date.getTime())) throw new Error(`Invalid date: ${input}`);
        return date;
    };

    const formatDate = (timestamp) => {
        const date = safeDate(timestamp);
        return encodeURIComponent(date.toISOString().replace(/-|:|\.\d\d\d/g, ''));
    };

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    const encodeParam = (value) => encodeURIComponent(value?.toString() || '');
    const formatOutlookDate = (input) => safeDate(input)
        .toISOString()
        .replace(/\.\d{3}Z$/, '');
    const encodedTitle = encodeParam(title);
    const encodedDesc = encodeParam(description);
    const encodedLocation = encodeParam(location);

    const googleLink = `https://calendar.google.com/calendar/u/0/r/eventedit?dates=${start}/${end}&details=${encodedDesc}&location=${encodedLocation}&text=${encodedTitle}`;

    const outlookStart = encodeParam(formatOutlookDate(startDate));
    const outlookEnd = encodeParam(formatOutlookDate(endDate));
    const outlookLink = `https://outlook.live.com/calendar/0/deeplink/compose?allday=false&body=${encodedDesc}&enddt=${outlookEnd}&location=${encodedLocation}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=${outlookStart}&subject=${encodedTitle}`;

    const yahooLink = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodedTitle}&st=${start}&et=${end}&desc=${encodedDesc}&in_loc=${encodedLocation}`;

    return {
        google: googleLink,
        outlook: outlookLink,
        yahoo: yahooLink
    };
}

function generateCalendarFile({ eventId, title, description, location, startDate, endDate }) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const modifiedAt = new Date();

    if (isNaN(start.getTime())) throw new Error(`Invalid start date: ${startDate}`);
    if (isNaN(end.getTime())) throw new Error(`Invalid end date: ${endDate}`);

    const formatDate = (date) => date.toISOString().replace(/[-:.]/g, '').replace(/\d{3}Z$/, 'Z');
    const escapeIcsText = (value = '') => String(value)
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\r?\n/g, '\\n');

    const fileNameDate = [
        modifiedAt.getUTCFullYear(),
        String(modifiedAt.getUTCMonth() + 1).padStart(2, '0'),
        String(modifiedAt.getUTCDate()).padStart(2, '0')
    ].join('') + '-' + [
        String(modifiedAt.getUTCHours()).padStart(2, '0'),
        String(modifiedAt.getUTCMinutes()).padStart(2, '0')
    ].join('');

    const safeEventId = String(eventId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const content = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Le Friturier//Events//FR',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${safeEventId}@le-friturier`,
        'SEQUENCE:0',
        `DTSTAMP:${formatDate(modifiedAt)}`,
        `DTSTART:${formatDate(start)}`,
        `DTEND:${formatDate(end)}`,
        `SUMMARY:${escapeIcsText(title)}`,
        `DESCRIPTION:${escapeIcsText(description)}`,
        `LOCATION:${escapeIcsText(location)}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n') + '\r\n';

    return {
        fileName: `${safeEventId}-${fileNameDate}.ics`,
        content: Buffer.from(content, 'utf8')
    };
}

module.exports = { generateCalendarLinks, generateCalendarFile };
