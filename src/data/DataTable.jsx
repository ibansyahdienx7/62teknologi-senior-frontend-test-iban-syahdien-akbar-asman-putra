import React, { useEffect, useMemo, useState } from "react";

import DataTable from "react-data-table-component";
import FilterComponent from "@/components/FilterComponent";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

const Table = props => {
    const MySwal = withReactContent(Swal);

    const [pending, setPending] = React.useState(true);
    const [columns, setColumns] = useState([]);
    const [detail, setDetail] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [activeMarker, setActiveMarker] = useState(null);

    function fetchDatas(alias) {
        const UrlYelp = "https://api-ibans.pesanin.com/v1/yelp/match";
        const params = {
            "slug": alias,
        }
        const requestOptionsZ = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(params)
        };
        fetch(`${UrlYelp}`, requestOptionsZ)
            .then(async responseZ => {
                const isJsonZ = responseZ.headers.get('content-type')?.includes('application/json');
                const dataZ = isJsonZ && await responseZ.json();

                // check for error responseZ
                if (!responseZ.ok) {
                    // get error message from body or default to responseZ status
                    const errorZ = (dataZ && dataZ.msg) || responseZ.status;
                    return Promise.reject(errorZ);
                }
                let dataResult = '';
                for (let indexDataCtg = 0; indexDataCtg < dataZ.data.categories.length; ++indexDataCtg) {
                    const JsonData = JSON.stringify({
                        "title": dataZ.data.categories[indexDataCtg].title,
                    });
                    const myObj = JSON.parse(JsonData);
                    dataResult += `${myObj.title}, `
                }

                let dataSlider = [];
                let nextIdslider = 1;
                for (let indexDataSlider = 0; indexDataSlider < dataZ.data.photos.length; ++indexDataSlider) {
                    const JsonDataSlider = JSON.stringify({
                        "id_slider": nextIdslider++,
                        "photo": dataZ.data.photos[indexDataSlider],
                    });
                    const myObjSlider = JSON.parse(JsonDataSlider);
                    dataSlider.push(myObjSlider);
                }

                const containerStyle = {
                    width: '400px',
                    height: '400px',
                    borderRadius: '10%'
                };

                const center = {
                    lat: dataZ.data.coordinates.latitude,
                    lng: dataZ.data.coordinates.longitude
                };

                const markers = [
                    {
                        id: 1,
                        name: dataZ.data.name,
                        position: center
                    }
                ];
                const handleActiveMarker = (marker) => {
                    if (marker === activeMarker) {
                        return;
                    }
                    setActiveMarker(marker);
                };

                const handleOnLoad = (map) => {
                    const bounds = new google.maps.LatLngBounds();
                    markers.forEach(({ position }) => bounds.extend(position));
                    map.fitBounds(bounds);
                };

                setDetail(
                    <>
                        {setShowModal(true)}
                        <div
                            className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto inset-0 md:inset-0 h-modal md:h-full" tabIndex={'-1'}
                        >
                            <div className="relative w-full h-full inset-0 md:inset-0 max-w-2xl md:h-auto items-center justify-center">
                                {/*content*/}
                                <div className="relative bg-white inset-0 md:inset-0 rounded-lg shadow dark:bg-gray-700">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {dataZ.data.name}
                                        </h3>
                                        <button
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <svg className="w-5 h-5" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                            </svg>
                                        </button>
                                    </div>
                                    {/*body*/}
                                    <div className="p-6 space-y-6">

                                        <div id="animation-carousel" className="relative carousel slide" data-carousel="slide" data-ride="carousel">
                                            <div className="carousel-inner relative h-56 overflow-hidden rounded-lg md:h-96">
                                                {dataSlider.map((dataSlider) => (
                                                    <div id={`carousel-item-${dataSlider.id_slider}`} key={dataSlider.photo} className={`carousel-item ${dataSlider.id_slider == 1 ? 'active' : ''} duration-200 ease-linear`} data-carousel-item={dataSlider.id_slider == 1 ? 'active' : ''}>
                                                        <img src={dataSlider.photo} alt={dataZ.data.name} title={dataZ.data.name} className={"shadow-lg shadow-blue-gray-500/40 absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"} />
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="button" onClick={() => prev()} className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev id="data-carousel-prev">
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                                    <svg aria-hidden="true" className="w-6 h-6 text-white dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                                    <span className="sr-only">Previous</span>
                                                </span>
                                            </button>
                                            <button type="button" onClick={() => next()} className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next id="data-carousel-next">
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                                    <svg aria-hidden="true" className="w-6 h-6 text-white dark:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                    <span className="sr-only">Next</span>
                                                </span>
                                            </button>
                                        </div>

                                        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                                            <div className="px-4 py-5 sm:px-6">
                                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                                    {dataZ.data.name}
                                                </h3>
                                                <p className="mt-1 max-w-2xl text-md text-gray-500">
                                                    <i className="fa fa-star text-yellow-500"></i> {dataZ.data.rating}/ {dataZ.data.review_count} Reviews
                                                </p>
                                            </div>
                                            <div className="border-t border-gray-200">
                                                <dl>
                                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{dataZ.data.name}</dd>
                                                    </div>
                                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            {dataResult}
                                                        </dd>
                                                    </div>
                                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-sm font-medium text-gray-500">Alias</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{dataZ.data.alias}</dd>
                                                    </div>
                                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <Link to={'tel:' + dataZ.data.phone} target={"blank"} className={"bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 cursor-pointer"}>
                                                                {dataZ.data.display_phone}
                                                            </Link>
                                                        </dd>
                                                    </div>
                                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            {dataZ.data.location.display_address}
                                                        </dd>
                                                    </div>
                                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-sm font-medium text-gray-500">Maps</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <div style={{ width: '100%' }}>
                                                                <LoadScript
                                                                    googleMapsApiKey="AIzaSyDdLwrkfOQNzH5Yk6yE-QiegJisSMbXzf8"
                                                                >
                                                                    <GoogleMap
                                                                        id="marker-example"
                                                                        mapContainerStyle={containerStyle}
                                                                        center={center}
                                                                        zoom={15}
                                                                        onClick={() => setActiveMarker(null)}
                                                                    >
                                                                        {markers.map(({ id, name, position }) => (
                                                                            <Marker
                                                                                key={id}
                                                                                position={position}
                                                                                onClick={() => handleActiveMarker(id)}
                                                                            >
                                                                                {activeMarker === id ? (
                                                                                    <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                                                                        <div>{name}</div>
                                                                                    </InfoWindow>
                                                                                ) : null}
                                                                            </Marker>
                                                                        ))}
                                                                    </GoogleMap>
                                                                </LoadScript>
                                                            </div>
                                                        </dd>
                                                    </div>
                                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                        <dt className="text-sm font-medium text-gray-500">Website</dt>
                                                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                                            <ul role="list" className="divide-y divide-gray-200 rounded-md">
                                                                <li className="flex items-center justify-between py-0 pl-3 pr-4 text-sm">
                                                                    <div className="flex w-0 flex-1 items-center">
                                                                        <span className="ml-2 w-0 flex-1 truncate">
                                                                            {dataZ.data.url}
                                                                        </span>
                                                                    </div>
                                                                    <div className="ml-4 flex-shrink-0">
                                                                        <a href={dataZ.data.url} target={"_blank"} className="font-medium text-indigo-600 hover:text-indigo-500">Visit</a>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                )
            })
            .catch(errorZ => {
                console.error('There was an error!', errorZ);
                MySwal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    html: 'Something went wrong! ' + errorZ,
                })
            })
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setColumns([
                {
                    name: "#",
                    selector: row => row.id,
                    sortable: true,
                    grow: 2
                },
                {
                    name: "Name",
                    selector: row => row.name,
                    sortable: true,
                    grow: 2
                },
                {
                    name: "Phone",
                    selector: row => row.phone,
                    sortable: true
                },
                {
                    name: "Address",
                    selector: row => row.addresess,
                    sortable: true,
                },
                {
                    name: "Action",
                    button: true,
                    cell: row =>
                        row.showButtons ? (
                            <>
                                <button
                                    onClick={() => fetchDatas(row.alias)}
                                    style={{ marginRight: "5px" }}
                                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded"
                                >
                                    Detail
                                </button>
                            </>
                        ) : null
                }
            ]);
            setPending(false);
        }, 3000);
        return () => clearTimeout(timeout);
    }, []);
    const [filterText, setFilterText] = React.useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(
        false
    );
    const filteredItems = props.data.filter(
        item =>
            JSON.stringify(item)
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1
    );

    const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <FilterComponent
                onFilter={e => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);

    return (

        <>
            <center>{showModal ? detail : null}</center>
            <DataTable
                columns={columns}
                data={filteredItems}
                defaultSortField="name"
                striped
                pagination
                subHeader
                subHeaderComponent={subHeaderComponent}
                progressPending={pending}
            />
        </>
    );
};

export default Table;
