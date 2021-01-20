# loguf
## Log User Flow

Log user flow events and exceptions.

## Usage

```bash
$ npm install --save loguf
```

```typescript
import Loguf from "loguf";

const SetupAppLog = (isProd: boolean) => {
	Loguf.setUri("my-loguf-server-uri");
  Loguf.setDebug(!isProd);
  Loguf.setUserId("Unique user or session identifier");
}

const MyCoolFunction = () => {
  try {
    /*
    	CODE
    */
    
    Loguf.event("User clicked button and triggered cool function");
  }
  catch (reason) {
    Loguf.exception("My cool function dont work :(", { errorMessage: reason });
  }
}
```

## Methods

### setUri(string)

Uri to Loguf server.

### setDebug(boolean)

If debug is set to true. Loguf will display logs sent to Loguf server in console.

### setUserId(string)

User id should be a unique user or session identifier.
User id is used to connect all logs into a user flow.

### event(string, any)

#### event: string

Event should be clear and readable for a better view of the user flow.

#### properties: any

Properties is not required but good if you want to provide more data in a log.

#### Examples:

- event: "Opened screen1"
- event: "Clicked add new friend"
  properties: { newFriendName: "John Smith" }
- event: "Sent message"

### exception(string, any)

#### event: string

Event should be clear and readable for a better view of the user flow.

#### properties: any

Properties is not required but good if you want to provide more data in a log.

#### Examples:

- event: "Could not get friend list"
  properties: { fetchError: reason }
- event: "Profile image is missing"
  properties: { user: "John Smith" }