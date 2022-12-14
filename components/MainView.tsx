import { ChangeEvent, useEffect, useState } from 'react';
import { GorodRequest } from './GorodRequest';
import moment from 'moment';

export const MainView = () => {
    const [allRequests, setAllRequests] = useState<GorodRequest[]>([]);
    const [firstSearch, setFirstSearch] = useState<boolean>(true);
    const [filters, setFilters] = useState<{ dateFrom?: number, dateTo?: number, overdueOnly?: boolean }>({overdueOnly: true});
    const [photoHidden, setPhotoHidden] = useState<{ [key: string]: boolean }>({});
    const [hiddenRequests, setHiddenRequests] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        fetch('/gorod-requests.json')
            .then(response => response.json())
            .then(json => {
                setAllRequests(json);
            })
    }, [])

    function changePhotosVisibility(index: string | number) {
        setPhotoHidden(prev => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    function hideRequest(index: number) {
        setHiddenRequests(prev => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    function fromDateChange(e: ChangeEvent<HTMLInputElement>) {
        setFilters(prev => ({
            ...prev,
            dateFrom: e.target.value ? moment.utc(e.target.value).toDate().getTime() : undefined,
        }))
    }

    function toDateChange(e: ChangeEvent<HTMLInputElement>) {
        setFilters(prev => ({
            ...prev,
            dateTo: e.target.value ? moment.utc(e.target.value).toDate().getTime() : undefined,
        }))
    }

    function applyFilter(req: any, index: number) {
        if (
            (!filters.dateFrom || new Date(req.publishDate).getTime() > filters.dateFrom)
            && (!filters.dateTo || new Date(req.publishDate).getTime() < filters.dateTo)
            && (!filters.overdueOnly || req.responses.filter((r: any) => r.isOverdue).length)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function onOverdueChange(e: ChangeEvent<HTMLInputElement>) {
        setFilters(prev => ({
            ...prev,
            overdueOnly: !prev.overdueOnly
        }))
    }

    return (
        <div>
            <div className={`p-2 print:hidden`}>
                <div className={`mb-2`}>
                    ???????????????????????? ????
                    <input type={`date`} className={`outline outline-amber-100 border border-gray-500 ml-2`}
                           onChange={fromDateChange}/> ????
                    <input type={`date`} className={`outline outline-amber-100 border border-gray-500 ml-2`}
                           onChange={toDateChange}/>
                </div>

                <div className={`mb-2`}>
                    ???????????? ???? ????????????
                    <input type={`text`} className={`outline outline-amber-100 border border-gray-500 ml-2`}/>
                </div>
                <div>
                    ?????????????????? ??????????
                    <input type={`checkbox`}
                           className={`outline outline-amber-100 border border-gray-500 ml-2`}
                           onChange={onOverdueChange}
                           checked={filters.overdueOnly}
                    />
                </div>
                <div>
                    ???????? ????????????
                    <input type={`checkbox`} className={`outline outline-amber-100 border border-gray-500 ml-2`}/>
                </div>
                <div>
                    ?????????????? ????????????
                    <input type={`checkbox`} className={`outline outline-amber-100 border border-gray-500 ml-2`}/>
                </div>
            </div>
            <div className={`p-2`}>
                {firstSearch && (
                    <button
                        className={`outline outline-amber-100 border border-gray-500 p-1 print:hidden mb-2`}
                        onClick={() => setFirstSearch(false)}>
                        ?????????????? ???????????????????? ????????????
                    </button>
                )}
                {!firstSearch && (
                    <div>
                        ???????????? ?????????????? {allRequests.filter(applyFilter).length}
                    </div>
                )}
            </div>
            {
                !firstSearch && allRequests
                    .filter(applyFilter)
                    .map((req, index) => (
                        <div key={index}
                             className={`bg-gray-200 m-2 p-2 border border-gray-500 ${hiddenRequests[index] ? 'print:hidden' : ''}`}>
                            <div>
                                <h1 className={'text-3xl text-gray-700 mb-2'}> ?????????????????? <span
                                    className={`text-lg`}>({req.requestNumber})</span></h1>
                                <button
                                    className={`border border-gray-500 outline-amber-100 pl-2 pr-2 bg-blue-50 outline print:hidden`}
                                    onClick={() => hideRequest(index)}>
                                    {`${hiddenRequests[index] ? '????????????????' : '????????????????'}`}
                                </button>
                            </div>
                            {
                                !hiddenRequests[index] && (
                                    <>
                                        <div>
                                            <span className={`underline`}>?????????? ????????????: </span>
                                            <a className={`text-blue-500 hover:text-blue-300`}
                                               target={`_blank`}
                                               href={`https://gorod.mos.ru/index.php?show=objects&action=show&id=2112352&addr=&comment=${req.requestNumber}#comments`}>
                                                {req.requestNumber}
                                            </a>
                                        </div>
                                        <div>
                                            <span className={`underline`}>????????: </span>
                                            <span>{req.header}</span>
                                        </div>
                                        <div>
                                            <span className={`underline`}>???????????????? ????????????????: </span>
                                            <span>{req.description}</span>
                                        </div>
                                        <div>
                                            <span className={`underline`}>???????? ??????????????????: </span>
                                            <span>{req.publishDateText}</span>
                                        </div>
                                        <div>
                                            <span className={`underline`}>??????????????????: </span>
                                            <span>{req.publisherName}</span>
                                        </div>
                                        <div>
                                            <span className={`underline`}>????????????????????: </span>
                                            {
                                                req.photoUrls.length > 0 && (
                                                    req.photoUrls.length === 0 ? '??????' :
                                                        <button
                                                            className={`outline outline-amber-100 border border-gray-500 p-1 print:hidden mb-2`}
                                                            onClick={() => changePhotosVisibility(index)}>
                                                            ??????/????????
                                                        </button>
                                                )
                                            }
                                            <div className={`flex flex-shrink-0 justify-start items-start flex-wrap`}>
                                                {
                                                    req.photoUrls
                                                        .filter(() => !photoHidden[index])
                                                        .map((photo, index) => (
                                                            <img key={index} src={photo}/>
                                                        ))
                                                }
                                            </div>
                                        </div>
                                        <h1 className={'text-3xl text-gray-700 mb-2 mt-2'}> ????????????</h1>
                                        <div className={`pl-4`}>
                                            {
                                                req.responses.map((resp, respIndex) => (
                                                    <div key={respIndex} className={`p-2`}>

                                                        <div>{resp.status}</div>
                                                        <div>{resp.statusDateText}</div>

                                                        <div>{resp.publishDateText}</div>
                                                        <div>{resp.userName}</div>
                                                        <div>{resp.overdueText}</div>
                                                        <div>{resp.text}</div>

                                                        <span className={`underline`}>????????????????????: </span>
                                                        {
                                                            resp.photoUrls.length === 0 ? '??????' :
                                                                <button
                                                                    className={`outline outline-amber-100 border border-gray-500 p-1 print:hidden mb-2`}
                                                                    onClick={() => changePhotosVisibility(`${index}-${respIndex}`)}>
                                                                    ??????/????????
                                                                </button>
                                                        }
                                                        <div
                                                            className={`flex flex-shrink-0 justify-start items-start flex-wrap`}>
                                                            {
                                                                resp.photoUrls
                                                                    .filter(() => !photoHidden[`${index}-${respIndex}`])
                                                                    .map((photo, index) => (
                                                                        <img key={index} src={photo}/>
                                                                    ))
                                                            }
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    ))
            }
        </div>
    )
}
