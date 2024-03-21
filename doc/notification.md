* Notifications are dispatched as a JS event.
* Notifications will be dispatched :
    * in the Notification area if user hasn't DEV role.
    * in ReportDevBar if user has DEV role (and also in Notification area if asked explicitly.)

# All attributes of `INotificationMessage`

    buttonLabel                 ?: string,
    buttonSeverity              ?: TSeverity
    buttonURL                   ?: string,  # link is a app path, handled by the app.
    buttonURLInNewTab           ?: boolean, # if true, link will be opened in new browser's tab.
    forceInNotificationCenter   ?: boolean,
    forDevBarOnly               ?: boolean
    life                        ?: number    # number of miliseconds the notification toast is displayed.
    message                      : string,
    new                         ?: boolean,
    reportId                    ?: number,
    severity                     : BadgeSeverityType,
    timestamp                    : number,
    toast                        : boolean,  # display notification in a toast which is display `live` miliseconds.
    title                        : string,
    type                         : EReportDevBarMessageType,

# Send a notification, related to a Report, which will fall in log tab for a dev user.

```typescript
    document.dispatchEvent(
        notificationEvent({
            message: error.message,
            reportId: <report_id>,
            timestamp: Date.now(),
            title: 'A title',
            type: EReportDevBarMessageType.LOG,
            severity: "info",
            toast: true,
        })
    );
```

# Send a notification, related to a Report, displaying only a toast, logging, without storing into notification center.

```typescript
    document.dispatchEvent(
        notificationEvent({
        message: 'Updated',
        reportId: report.id,
        timestamp: Date.now(),
        title: 'Updated',
        type: EReportDevBarMessageType.LOG,
        severity: "info",
        toast: true,
        life: 1000,
        })
    );
```

# Send a notification, _not_ related to a Report, forcing display in a toast, even for dev user.

```typescript
    document.dispatchEvent(
        notificationEvent({
            message: t('settings:version.check_release_note', {version: versionsInfo[0].available_version}),
            timestamp: Date.now(),
            title: t('settings:version.new_version_available'),
            type: EReportDevBarMessageType.LOG,
            severity: "info",
            toast: true,
            forceInNotificationCenter: true
        })
    );
```