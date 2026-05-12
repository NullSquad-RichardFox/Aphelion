<script setup>
import { LocalNotifications } from '@capacitor/local-notifications';


const pushNotification = async () => {
    const permissions = await LocalNotifications.checkPermissions();
    
    if (permissions.display === 'prompt') {
        const res = await LocalNotifications.requestPermissions();
    }

    await LocalNotifications.schedule({
        notifications: [{
            id: 1,
            title: "Test title",
            body: "test body",
            schedule: {
                every: 'minute'
            }
        }]
    })

    const x = await LocalNotifications.getPending();
    console.log(x);
}


</script>

<template>
<p class="title">Aphelion</p>

<p>New workout</p>

<div>
    <p>Suplements</p>
    <button style="width: 100px; height: 60px;" @click="pushNotification">click</button>
</div>

<div>
    <p>Weight</p>
</div>

<div>
    <p>Sleep</p>
</div>

</template>

<style scoped> 
.title {
    font-size: 40px;
    text-align: left;
    margin-top: 1.2rem;
}
</style>