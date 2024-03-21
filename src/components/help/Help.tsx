import { Card }                   from "primereact/card";
import { Button }                 from "primereact/button";
import { Dialog }                 from "primereact/dialog";
import * as React                 from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation }         from "react-i18next";

import THelpCard                  from "../../types/THelpCard";
import CenteredLoading            from "../common/loading/CenteredLoading";
import { context as authContext } from "../../contexts/auth/store/context";
import configure_connector        from "../../images/help/configure_connector/configure_connector.jpg";
import first_report               from "../../images/help/first_report/first_report.png";
import keyboard_shortcuts         from "../../images/help/keyboard_shortcuts/keyboard_shortcuts.jpg";
import report_parameters          from "../../images/help/report_parameters/report_parameters.png";
import report_links               from "../../images/help/report_links/report_links.jpg";
import { ERole }                  from "../../types/ERole";

const FirstReport = React.lazy(() => import ("./FirstReport"));
const ConfigureConnector = React.lazy(() => import("./ConfigureConnector"));
const KeyboardShortcuts = React.lazy(() => import("./KeyboardShortcuts"));
const ReportParameters = React.lazy(() => import("./ReportParameters"));
const ReportLinks = React.lazy(() => import("./ReportLinks"));

const Help: React.FC = (): React.ReactElement => {

    const {t} = useTranslation('help');
    const {helperCardPath} = useParams();
    const navigate = useNavigate();

    const {state: authState} = React.useContext(authContext);

    const [dialogVisible, setDialogVisible] = React.useState<boolean>(false);
    const [currentDialogContent, setCurrentDialogContent] = React.useState<React.ReactElement>(<></>);
    const [currentDialogTitle, setCurrentDialogTitle] = React.useState<string>('');

    const helpCards: Array<THelpCard> = [
        {
            key: 'configure_connector',
            group_translation_key: 'configure_connector',
            image: configure_connector,
            dialogContent: <ConfigureConnector/>,
            roles: [ERole.DEVELOPER, ERole.DEMO_DEVELOPER],
            path: 'configure-connector'
        },
        {
            key: 'first_report',
            group_translation_key: 'first_report',
            image: first_report,
            dialogContent: <FirstReport/>,
            roles: [ERole.DEVELOPER, ERole.DEMO_DEVELOPER],
            path: 'first-report'
        },
        {
            key: 'report_parameters',
            group_translation_key: 'report_parameters',
            image: report_parameters,
            dialogContent: <ReportParameters/>,
            roles: [ERole.DEVELOPER, ERole.DEMO_DEVELOPER],
            path: 'report-parameters'
        },
        {
            key: 'report_links',
            group_translation_key: 'report_links',
            image: report_links,
            dialogContent: <ReportLinks/>,
            roles: [ERole.DEVELOPER, ERole.DEMO_DEVELOPER],
            path: 'report-links'
        },
        {
            key: 'keyboard_shortcuts',
            group_translation_key: 'keyboard_shortcuts',
            image: keyboard_shortcuts,
            dialogContent: <KeyboardShortcuts/>,
            roles: [ERole.VIEWER, ERole.ADMINISTRATOR, ERole.DEVELOPER, ERole.DEMO_DEVELOPER],
            path: 'keyboard-shortcuts'
        },
    ];


    // Used to open directly a helper card dialog,
    // without the tab, like Settings components
    // helperCardPath variable (initialized in RouteSwitch.tsx).
    //
    React.useEffect(() => {

        if (helperCardPath) {

            const helpCard = helpCards.find((helperCard: THelpCard) => helperCard.path === helperCardPath);
            if (helpCard) {
                setCurrentDialogTitle(t(`help:cards.${helpCard.group_translation_key}.title`).toString())
                setCurrentDialogContent(helpCard.dialogContent);
                setDialogVisible(true);

            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [helperCardPath, t]);


    return (
        helperCardPath
            // Display HelpCard contents.
            ? <Dialog header={currentDialogTitle}
                      visible={dialogVisible}
                      style={{width: '80vw'}}
                      onHide={() => {
                          setDialogVisible(false);
                          setCurrentDialogContent(<></>);
                          setCurrentDialogTitle('');
                          navigate(-1);
                      }}
                      maximizable
            >
                <React.Suspense fallback={<CenteredLoading/>}>
                    {currentDialogContent}
                </React.Suspense>

            </Dialog>
            // List HelperCard.
            : <div id="help" className="flex flex-wrap justify-content-center gap-2">

                {helpCards.filter((helpCard: THelpCard) => {

                    return authState.user.organization_user.role_ids.some(role_id => helpCard.roles.includes(role_id))
                }).map((helpCard: THelpCard) => {

                    return (
                        <div key={`div_${helpCard.key}`} className="flex-column m-2">
                            <Card key={helpCard.group_translation_key}
                                  title={<>{t(`help:cards.${helpCard.group_translation_key}.title`).toString()}</>}
                                  subTitle={<>{t(`help:cards.${helpCard.group_translation_key}.subtitle`).toString()}</>}
                                  style={{width: '25em'}}
                                  header={<img alt="Card" src={helpCard.image}/>}
                                  footer={
                                      <span className="centered-content">
                                        <Button id={`button_${helpCard.path}`}
                                                label={t('help:view').toString()} icon="pi pi-eye"
                                                onClick={() => {
                                                    navigate(`/display-help/${helpCard.path}`, {replace: false});
                                                }}
                                        />
                                    </span>
                                  }
                            >
                                <p className="m-0" style={{lineHeight: '1.5'}}>
                                    {<>{t(`help:cards.${helpCard.group_translation_key}.summary`)}</>}
                                </p>
                            </Card>
                        </div>
                    )
                })}
            </div>
    )
}

export default Help