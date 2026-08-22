/* -------------------------------------------------------------------------- */
/*                    Imperial Aurum Admin Push Service Worker                */
/* -------------------------------------------------------------------------- */

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  let payload;

  try {
    payload = event.data.json();
  } catch {
    payload = {
      title: "Imperial Aurum Mining",
      body: event.data.text(),
    };
  }

  const title =
    typeof payload.title === "string" &&
    payload.title.length > 0
      ? payload.title
      : "Imperial Aurum Mining";

  const body =
    typeof payload.body === "string"
      ? payload.body
      : "";

  const icon =
    typeof payload.icon === "string"
      ? payload.icon
      : "/favicon.ico";

  const badge =
    typeof payload.badge === "string"
      ? payload.badge
      : "/favicon.ico";

  const tag =
    typeof payload.tag === "string"
      ? payload.tag
      : "imperial-aurum-admin";

  const url =
    typeof payload.url === "string"
      ? payload.url
      : "/admin";

  const notificationData =
    payload.data &&
    typeof payload.data === "object"
      ? payload.data
      : {};

  const options = {
    body,
    icon,
    badge,
    tag,
    data: {
      ...notificationData,
      url,
    },
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(
      title,
      options,
    ),
  );
});


/* -------------------------------------------------------------------------- */
/*                         Notification Click                                */
/* -------------------------------------------------------------------------- */

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const notificationData =
      event.notification.data;

    const targetUrl =
      notificationData &&
      typeof notificationData.url ===
        "string"
        ? notificationData.url
        : "/admin";

    event.waitUntil(
      openNotificationUrl(
        targetUrl,
      ),
    );
  },
);


/* -------------------------------------------------------------------------- */
/*                         Open Admin Page                                   */
/* -------------------------------------------------------------------------- */

async function openNotificationUrl(
  targetUrl,
) {
  const absoluteUrl =
    new URL(
      targetUrl,
      self.location.origin,
    ).href;

  const clientList =
    await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

  for (const client of clientList) {
    if (
      "focus" in client &&
      client.url.startsWith(
        self.location.origin,
      )
    ) {
      await client.focus();

      if (
        "navigate" in client &&
        client.url !== absoluteUrl
      ) {
        await client.navigate(
          absoluteUrl,
        );
      }

      return;
    }
  }

  if (
    self.clients.openWindow
  ) {
    await self.clients.openWindow(
      absoluteUrl,
    );
  }
}