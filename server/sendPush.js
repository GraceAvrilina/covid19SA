const webpush = require('web-push');

(async () => {

  webpush.setGCMAPIKey(process.env.FIREBASE_SERVER_API_KEY);
  webpush.setVapidDetails(
    `mailto:${process.env.EMAIL_FOR_SUBJECT}`,
    process.env.FIREBASE_WEB_PUSH_PUBLIC_VAPID_KEY,
    process.env.FIREBASE_WEB_PUSH_PRIVATE_VAPID_KEY
  );

  // This is the output of calling JSON.stringify on a PushSubscription you receive on your client
  // Copy paste the console log of push subscription from the receiver client here
  const pushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/dr77GvUWPUE:APA91bEeQcc8TaAd6J_Mt8oCkV03dnbMrKW71r6NwV4CXlxl4IXDq0aUgQK6nGy-4SfhfDT4K76BEZcnlSrGH3aA4QJHtzaC9rUw82fU_-wM0NuaOFg5Th3-1jjynTDTeLxJxeiQli1z',
    keys: {
      auth: 'EAHNJ3Gx5qHmmrBfMpZoeQ',
      p256dh: 'BAAx13dT9J_Kk3ZUjuHR6zWLlUDHd462JHaHDipLWwbJgTwv-r_oJOrKnk-OubM02nsnVnl4U_wS1Q1rLgwRsXM'
    }
  };

  const notificationPayload = {
    notification: {
      title: 'Ada Task yang belum di selesaikan',
      body: '[Reminder] Anda belum mengisi taks hari ini. Apabila anda sudah mengisi task hari ini abaikan pesan ini',
      icon: 'assets/pwa/manifest-icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
      },
      actions: [{
        action: 'task',
        title: 'Assessment'
      }]
    }
  };

  try {
    // Send the push notification
    await webpush.sendNotification(pushSubscription, JSON.stringify(notificationPayload));
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

})();