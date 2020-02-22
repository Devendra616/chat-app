# Chat Application

A simple chat application using NodeJS and Socket.io to let users chat in realtime across various private rooms.

  - Login to a room providing your Display Name and Room Id to join. 
        For Example: Display Name: Rakesh, Room Id: 6
  - All users with same Room Id can see one other's messages and chat among.
  - When a user joins a chat room, he gets a welcome message from the System and other users in the room gets notified about the new person joining the room.
  - Simarly when the user logout from the chat application, he is redirected to Login Page and other users in the room gets notfied about the person leaving the room.
  - You can enable Notification feature from chat screen. When you minimise your chat browser window and if some one in your chat room sends a message, you get a notification banner of the message.
  - When a person starts typing in his message console, the other users gets visual impression that the person is typing...
  - When a message is read, it gets marked to sender with a circle and green tick.

# Snapshots!
 ### Login
   ![login](https://res.cloudinary.com/nmdc/image/upload/v1582347550/Chat%20Application/WhatsApp_Image_2020-02-20_at_5.36.45_PM.jpg)
 ### Welcome message
 ![Welcome Message](https://res.cloudinary.com/nmdc/image/upload/v1582347549/Chat%20Application/WhatsApp_Image_2020-02-20_at_5.42.43_PM.jpg)
 ### On Logout
 ![Logout](https://res.cloudinary.com/nmdc/image/upload/v1582347531/Chat%20Application/WhatsApp_Image_2020-02-20_at_5.45.25_PM.jpg)
 ### Notification on minimised browser
  ![Notification](https://res.cloudinary.com/nmdc/image/upload/v1582347532/Chat%20Application/WhatsApp_Image_2020-02-20_at_5.44.35_PM.jpg)
  ## Short video
  [![Short Video](https://res.cloudinary.com/nmdc/image/upload/v1582348815/Chat%20Application/video_url.jpg)](https://res.cloudinary.com/nmdc/video/upload/v1582347614/Chat%20Application/New_video.mp4)

# Installation

Install the dependencies and devDependencies and start the server.

```sh
$ npm install
$ npm start or
$ node index.js
```

# Further Works to be done (To - Dos)

The chat application can be improved alot and may be considered in next version.
- Integrating with database to save chat messages and retrive them.
- Inviting persons to join the chat.
- Clicking on notification banner opens the chat window. 
- UI/UX improvement.
- Making it mobile friendly, more responsive.
- Provision of attachment so that user may share docs, images and pdf.
