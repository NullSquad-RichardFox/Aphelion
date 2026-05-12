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
    <div>
        <ListItem>
            <input type="checkbox" />
            <p>Name</p>
        </ListItem> 
    </div>
</div>

<div>
    <p>Weight</p>
    <input type='text' placeholder="Add today's weight"/>
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