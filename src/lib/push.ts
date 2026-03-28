import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:notifications@findingmyzen.app",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: { title: string; body: string; url?: string }
) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error: unknown) {
    const statusCode =
      error instanceof Error && "statusCode" in error
        ? (error as { statusCode: number }).statusCode
        : undefined;

    // 410 Gone means the subscription is no longer valid
    if (statusCode === 410) {
      return { success: false, expired: true };
    }
    return { success: false, expired: false };
  }
}
