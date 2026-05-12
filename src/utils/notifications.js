import { LocalNotifications } from "@capacitor/local-notifications"

async function scheduleNotification(id, title, body, atTime, repeat = false, timeInterval = 'day') {
    const permissions = await LocalNotifications.checkPermissions();
    
    if (permissions.display === 'prompt') {
        await LocalNotifications.requestPermissions();
    }

    await LocalNotifications.schedule({
        notifications: [{
            id: id,
            title: title,
            body: body,
            schedule: {
                at: atTime,
                every: timeInterval,
                repeat: repeat
            }
        }]
    });
}

async function cancelNotification(id) {
    const permissions = await LocalNotifications.checkPermissions();

    if (permissions.display === 'prompt') {
        await LocalNotifications.requestPermissions();
    }

    await LocalNotifications.cancel({notifications: [{id: id}]});
}

export { scheduleNotification, cancelNotification };