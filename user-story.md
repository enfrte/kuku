Currently if I create new courses or edit existing courses in admin section, the changes are saved in my browser db store. However, if I commit the changes and deploy to vercel, the changes are not pushed to the public app because they don't exist locally in my repo and are not loaded when the app is first launched. 

- Fix this so that doing course crud operations saves a copy I can actually deploy. 
- Keep the existing backup functionality so I can revert to a previous version if something goes wrong. 
- When the user first opens the app, if no local courses exist, load the deployed courses. If local courses do exist, do not load them --unless the newly deployed courses version is greater than the users current version. In this scenario, offer to update the local courses with the updates. 
