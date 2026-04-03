---
sidebar_position: 4
---

# User Management

Once a user is connected to `ErmisChat`, broad query methods for discovering other actors in the system, viewing contacts, and updating own profiles are available directly within the global client session.

## Querying and Searching

Retrieve users registered inside your Ermis Project using these methods.

### Paginated User Search
```typescript
// Query full paginated user list (by page size & page number)
const usersData = await chatClient.queryUsers('25', 1); // pageSize = 25, page = 1

// Search users by name
const searchResult = await chatClient.searchUsers(1, 25, 'Jane Doe'); 
```

### Targeted User Retrieval
```typescript
// Target a specific single user ID
const userDetail = await chatClient.queryUser('user-xyz');

// Retrieve batched users by an explicit list of IDs
const users = await chatClient.getBatchUsers(['user-1', 'user-2']);
```

## Contacts

Ermis maintains contact relationship structures. You can query contacts to fetch users interacting frequently or explicitly marked by blocklist rules:
```typescript
// Fetch user's contact list
const { contact_users, block_users } = await chatClient.queryContacts();

console.log("Allowed Users", contact_users);
console.log("Blocked Users", block_users);
```

## Updating Profiles

The client exposes shortcuts to mutate the authenticated user's profile metadata and avatar image.

### Metadata
```typescript
await chatClient.updateProfile('New User Name', 'My updated about me...');
```

### Avatar
```typescript
// Construct a browser File Blob or Node.JS File Stream representing the new image
const newAvatarFile = new File([...], 'avatar.png');

const response = await chatClient.uploadFile(newAvatarFile);

console.log('New Avatar URL uploaded:', response.avatar);
```

## Real-time Profile Sync (SSE)

After `connectUser` succeeds, the SDK automatically opens a **Server-Sent Events (SSE)** connection to receive real-time profile updates. When any user in the project changes their name, avatar, or about-me, the SDK:

1. Updates the user in `client.state.users`.
2. Propagates changes to every active channel's member list, watchers, and message references.
3. For **direct messaging** channels, automatically updates the channel name and image to reflect the other user's new profile.

### `connectToSSE`

Called internally by `connectUser`. You can also call it manually with an optional callback to react to profile update events:

```typescript
await chatClient.connectToSSE((data) => {
  // data.type === 'AccountUserChainProjects'
  console.log('User profile updated:', data.name, data.avatar);
});
```

### `disconnectFromSSE`

Closes the SSE connection. Useful when tearing down the client manually.

```typescript
await chatClient.disconnectFromSSE();
```
