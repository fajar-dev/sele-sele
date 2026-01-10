import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";

export default {
  async onConnect(conn: Party.Connection, room: Party.Room) {
    return onConnect(conn, room, {
      // experimental: persist the document to partykit storage
      persist: true
    });
  }
} satisfies Party.Server;