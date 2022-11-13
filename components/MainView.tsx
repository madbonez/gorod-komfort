import { useEffect, useState } from 'react';
import { GorodRequest } from './GorodRequest';

export const MainView = () => {
    const [allRequests, setAllRequests] = useState<GorodRequest[]>([]);
    const [filters, setFilters] = useState<{}>({});
    const [photoHidden, setPhotoHidden] = useState<{ [key: number]: boolean }>({});

    useEffect(() => {
        fetch('/gorod-requests.json')
            .then(response => response.json())
            .then(json => {
                setAllRequests(json);
            })
    }, [])

    function togglePhoto() {
        setPhotoHidden({});
    }

    function changePhotosVisibility(index: number) {
        console.log(index)
        setPhotoHidden(prev => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    return (
        <div>
            <div className={`p-2 print:hidden`}>
                <div className={`mb-2`}>
                    Опубликованы от
                    <input type={`date`} className={`outline outline-amber-100 border border-gray-500 ml-2`}/> до
                    <input type={`date`} className={`outline outline-amber-100 border border-gray-500 ml-2`}/>
                </div>

                <div className={`mb-2`}>
                    Фильтр по тексту
                    <input type={`text`} className={`outline outline-amber-100 border border-gray-500 ml-2`}/>
                </div>
                <div>
                    Просрочен ответ
                    <input type={`checkbox`} className={`outline outline-amber-100 border border-gray-500 ml-2`}/>
                </div>
                <div>
                    Срыв сроков
                    <input type={`checkbox`} className={`outline outline-amber-100 border border-gray-500 ml-2`}/>
                </div>
                <div>
                    Перенос сроков
                    <input type={`checkbox`} className={`outline outline-amber-100 border border-gray-500 ml-2`}/>
                </div>
                <div>
                    <button className={`outline outline-amber-100 border border-gray-500 p-2`}
                            onClick={togglePhoto}>
                        Фотографии открыть все
                    </button>
                </div>
            </div>
            {
                allRequests.map((req, index) => (
                    <div key={index} className={`bg-gray-200 m-2 p-2 border border-gray-500 `}>
                        <h1 className={'text-3xl text-gray-700 mb-2'}> Обращение</h1>
                        <div>
                            <span className={`underline`}>Номер заявки: </span>
                            <a className={`text-blue-500 hover:text-blue-300`}
                               target={`_blank`}
                               href={`https://gorod.mos.ru/index.php?show=objects&action=show&id=2112352&addr=&comment=${req.requestNumber}#comments`}>
                                {req.requestNumber}
                            </a>
                        </div>
                        <div>
                            <span className={`underline`}>Тема: </span>
                            <span>{req.header}</span>
                        </div>
                        <div>
                            <span className={`underline`}>Описание проблемы: </span>
                            <span>{req.description}</span>
                        </div>
                        <div>
                            <span className={`underline`}>Дата обращения: </span>
                            <span>{req.publishDateText}</span>
                        </div>
                        <div>
                            <span className={`underline`}>Заявитель: </span>
                            <span>{req.publisherName}</span>
                        </div>
                        <div>
                            <span className={`underline`}>Фотографии: </span>
                            <button className={`outline outline-amber-100 border border-gray-500 p-1 print:hidden mb-2`}
                                    onClick={() => changePhotosVisibility(index)}>
                                вкл/выкл
                            </button>
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
                        <h1 className={'text-3xl text-gray-700 mb-2 mt-2'}> Ответы</h1>
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

                                        <span className={`underline`}>Фотографии: </span>
                                        {
                                            resp.photoUrls.length > 0 && <button className={`outline outline-amber-100 border border-gray-500 p-1 print:hidden mb-2`}
                                                    onClick={() => changePhotosVisibility(index)}>
                                                вкл/выкл
                                            </button>
                                        }
                                        <div className={`flex flex-shrink-0 justify-start items-start flex-wrap`}>
                                            {
                                                resp.photoUrls
                                                    .filter(() => !photoHidden[index])
                                                    .map((photo, index) => (
                                                        <img key={index} src={photo}/>
                                                    ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
