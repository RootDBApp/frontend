import { Button }         from "primereact/button";
import { Dialog }         from "primereact/dialog";
import { MenuItem }       from "primereact/menuitem";
import { Steps }          from "primereact/steps";
import * as React         from "react";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";


import { context as authContext } from "../../../contexts/auth/store/context";
import CenteredLoading            from "../../common/loading/CenteredLoading";
import { ERole }                  from "../../../types/ERole";

const OverviewDeveloper = React.lazy(() => import('./OverviewDeveloper'));
const OverviewViewerOrAdmin = React.lazy(() => import('./OverviewViewerOrAdmin'));

const Overview: React.FC = (): React.ReactElement => {


    const navigate = useNavigate();
    const {t} = useTranslation('help');

    const {state: authState} = React.useContext(authContext);

    const [activeIndex, setActiveIndex] = React.useState<number>(0);
    const [items, setItems] = React.useState<Array<MenuItem>>([]);

    return (
        <Dialog
            visible
            style={{width: '80vw'}}
            onHide={() => {
                navigate('/home');
            }}
            maximizable
            header={t('menu:quick_tour').toString()}
        >

            <div className="grid">

                <div className="col-12 flex justify-content-center">

                    <span className="p-buttonset ">
                        <Button label={t('menu:previous').toString()}
                                onClick={() => {
                                    setActiveIndex(activeIndex - 1)
                                }}
                                disabled={activeIndex === 0}
                                icon="pi pi-arrow-left"
                        />
                        <Button label={t('menu:next').toString()}
                                onClick={() => {
                                    setActiveIndex(activeIndex + 1)
                                }}
                                disabled={activeIndex === (items.length - 1)}
                                icon="pi pi-arrow-right"
                                iconPos="right"
                        />

                        <Button label={t('help:not_now').toString()}
                                onClick={() => {
                                    navigate('/home');
                                }}
                                className="ml-2"
                                disabled={activeIndex === (items.length - 1)}
                                icon="pi pi-times"
                                iconPos="right"
                                severity="danger"
                        />
                    </span>
                </div>

                <div className="col-12 ">
                    <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false}/>
                </div>

                <div className="col-12 justify-content-left mt-4" style={{minHeight: '50vh'}}>

                    <React.Suspense fallback={<CenteredLoading/>}>

                        {authState.user.organization_user.role_ids.some(role_id => [ERole.DEVELOPER, ERole.DEMO_DEVELOPER].includes(role_id)) ?
                            <OverviewDeveloper
                                activeIndex={activeIndex}
                                setItems={(items: Array<MenuItem>) => {
                                    setItems(items)
                                }}
                            />
                            :
                            <OverviewViewerOrAdmin
                                activeIndex={activeIndex}
                                setItems={(items: Array<MenuItem>) => {
                                    setItems(items)
                                }}
                            />
                        }

                    </React.Suspense>
                </div>

            </div>

        </Dialog>
    );
}

export default Overview;