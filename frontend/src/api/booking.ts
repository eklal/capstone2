/** fetch bookings for a trainer (simulate) */
export type Booking = {
    id: string;
    client: string;
    service: string;
    date: string;
    duration: string;
    amount: number;
    status: "pending" | "accepted" | "rejected" | "accepted";
};

const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));

export async function getBookings(trainerId?: number): Promise<Booking[]> {
    await wait(900);
    const module = await import("../data/bookings.json");
    const data = (module.default || module) as any[];

    return data.map((item) => ({
        ...item,
        status: item.status.toLowerCase() as "pending" | "accepted" | "rejected",
    }));
}

/** update booking status (simulate server call) */
export async function updateBookingStatus(bookingId: string, status: Booking["status"]): Promise<{ ok: boolean; bookingId: string; status: string; }> {
    await wait(600);
    // In a real API you would POST to server and persist. Here we simply return success.
    return { ok: true, bookingId, status };
}