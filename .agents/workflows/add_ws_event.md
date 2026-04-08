---
description: "How to add a new Websocket event properly to the SDK and React UI."
---

# Workflow: Adding a New WebSocket Event

When the backend introduces a new real-time event, follow these steps to integrate it end-to-end:

1. **Define the Event Type:**
   - Update `EVENT_MAP` (or `<ErmisChatGenerics>`) to include the new literal string for the event (e.g., `member.updated`).
   - Add the necessary TypeScript interfaces in `types.ts` mimicking the event payload.

2. **Handle in Client (`client.ts`):**
   - Inside the method `_handleClientEvent(event: Event<ErmisChatGenerics>)` in `client.ts`:
     - Add an `if (event.type === 'your_new_event')` condition.
     - Execute any necessary data fetching (e.g., loading missing user details).
     - If it involves channel states, apply the update to `this.activeChannels[event.cid].state`.
     - Push any post-dispatch side effect callbacks if necessary.

3. **Dispatch to Listeners:**
   - The event natively routes to `.on()` consumers. No additional custom dispatcher is usually needed if step 2 handles the global `ClientState` update.

4. **React UI Integration (`App.tsx` or `Channel` components):**
   - Use the `useEffect` hook to attach a listener:
     ```tsx
     useEffect(() => {
       const listener = client.on('your_new_event', (event) => {
           // Handle UI update
       });
       return () => listener.unsubscribe();
     }, [client]);
     ```
   - Make sure memory leaks are prevented by unsubscribing on component unmount.
