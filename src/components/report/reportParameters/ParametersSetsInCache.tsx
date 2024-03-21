import { t }                 from "i18next";
import { Card }              from "primereact/card";
import { TabPanel, TabView } from "primereact/tabview";
import * as React            from "react";

import TReport              from "../../../types/TReport";
import { apiSendRequest }   from "../../../services/api";
import { EAPIEndPoint }     from "../../../types/EAPIEndPoint";
import ReportParameters     from "../ReportParameters";
import CenteredLoading      from "../../common/loading/CenteredLoading";
import { useMobileLayout }  from "../../../utils/windowResize";
import TReportParameterSets from "../../../types/TReportParameterSets";


const ParametersSetsInCache: React.FC<{
    onSubmit: CallableFunction,
    report: TReport,
    reportIsEmbedded: boolean,
    reportId?: number,
    reportInstanceId?: number,
    securityHash?: string,
    webSocketPublicUserId?: string,
}> = ({
          onSubmit,
          report,
          reportIsEmbedded,
          reportId,
          reportInstanceId,
          securityHash,
          webSocketPublicUserId,
      }): React.ReactElement => {

    const [allCacheJobParametersSets, setAllCacheJobParametersSets] = React.useState<Array<TReportParameterSets>>([]);
    const [allUserJobParametersSets, setAllUserJobParametersSets] = React.useState<Array<TReportParameterSets>>([]);
    // const [cardIdx, setCardIdx] = React.useState<number>(0);
    const isMobile = useMobileLayout();
    let cardId = 0;

    const getCacheJobParametersSets = (): void => {

        apiSendRequest({
            method: 'GET',
            endPoint: reportIsEmbedded ? EAPIEndPoint.PUBLIC_REPORT : EAPIEndPoint.REPORT,
            resourceId: report.id,
            extraUrlPath: 'parameters-sets-in-cache',
            urlParameters: [{key: 'type', value: 'job'}],
            callbackSuccess: (response: Array<TReportParameterSets>) => {

                setAllCacheJobParametersSets(response);
            }
        });
    }

    const getUserJobParametersSets = (): void => {

        apiSendRequest({
            method: 'GET',
            endPoint: reportIsEmbedded ? EAPIEndPoint.PUBLIC_REPORT : EAPIEndPoint.REPORT,
            resourceId: report.id,
            extraUrlPath: 'parameters-sets-in-cache',
            urlParameters: [{key: 'type', value: 'user'}],
            callbackSuccess: (response: Array<TReportParameterSets>) => {

                setAllUserJobParametersSets(response);
            }
        });
    }

    React.useEffect(() => {

        if (report.has_cache) {

            if (report.has_job_cache) {
                getCacheJobParametersSets();
            }

            if (report.has_user_cache) {
                getUserJobParametersSets();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{marginTop: '1rem'}}>
            <TabView
                renderActiveOnly={false}
                activeIndex={report.has_job_cache ? 0 : (report.has_user_cache ? 1 : 0)}
            >
                {report.has_job_cache &&
                    <TabPanel header={t('report:cache.job_caches')}>
                        {allCacheJobParametersSets.length === 0
                            ? <CenteredLoading/>
                            : <div className="grid ">
                                {allCacheJobParametersSets.map((reportParameterSets: TReportParameterSets) => (
                                    <div key={`card_job_${cardId++}`} className="col">
                                        <Card
                                            style={{width: isMobile ? '80vw' : '400px'}}
                                            title={`${t('report:cache.from_cache_id')} ${reportParameterSets.cache_job_id}`}
                                            subTitle={`${t('report:cache.cached_at')} ${reportParameterSets.cached_at.toString()}`}
                                        >
                                            <ReportParameters
                                                overrideReportParameters
                                                reportParametersOverride={reportParameterSets.report_parameters}
                                                report={report}
                                                onSubmit={onSubmit}
                                                reportIsEmbedded
                                                reportId={reportId}
                                                reportInstanceId={reportInstanceId}
                                                securityHash={securityHash}
                                                webSocketPublicUserId={webSocketPublicUserId}
                                            />
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        }
                    </TabPanel>
                }
                {report.has_user_cache &&
                    <TabPanel header={t('report:cache.user_caches')}>
                        {allUserJobParametersSets.length === 0
                            ? <CenteredLoading/>
                            : <div className="grid ">
                                {allUserJobParametersSets.map((reportParameterSets: TReportParameterSets) => (
                                    <div key={`card_use_${cardId++}`} className="col">
                                        <Card
                                            style={{width: isMobile ? '80vw' : '500px'}}
                                            subTitle={`${t('report:cache.cached_at')} ${reportParameterSets.cached_at.toString()}`}
                                        >
                                            <ReportParameters
                                                overrideReportParameters
                                                reportParametersOverride={reportParameterSets.report_parameters}
                                                report={report}
                                                onSubmit={onSubmit}
                                                reportIsEmbedded
                                                reportId={reportId}
                                                reportInstanceId={reportInstanceId}
                                                securityHash={securityHash}
                                                webSocketPublicUserId={webSocketPublicUserId}
                                            />
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        }
                    </TabPanel>
                }
            </TabView>
        </div>
    )
}

export default ParametersSetsInCache;