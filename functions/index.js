const fetch = require("node-fetch");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Firebaseのデフォルトアプリを初期化する
admin.initializeApp();

const channelWebhookUrl = "ここにウェブフックのURLが入ります";

exports.sendDiscordNotification = functions.firestore
  .document("messages/{messageId}")
  .onWrite(async (change, context) => {
    const db = admin.firestore();
    const messageId = context.params.messageId;
    const messageDoc = await db.collection("messages").doc(messageId).get();
    if (!messageDoc.exists) return;
    const messageData = await messageDoc.data();
    const message = `${messageData.content}`;

    await fetch(channelWebhookUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        content: `${message}`,
      }),
    });
  });
