# To add a new custom tab

1. Edit `pathDrivenTabService.tsx`
2. Edit `PathDriveTab.tsx`, and add something like :
   ```typescript
    {tab.type === EPDTTabType.HELP && <><i className="pi pi-question mr-2"></i>{t('common:help')}</>}
    ```