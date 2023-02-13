import Table from "@/data/DataTable";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function dataBisnis() {
    const MySwal = withReactContent(Swal);

    const [postsJob, setPost] = useState([]);
    const clickhandler = name => console.log("delete", name);

    const UrlYelp = "https://api-ibans.pesanin.com/v1/yelp/list";
    const params = {
        "latitude": '41.7873382568359',
        "longtitude": '-123.051551818848',
        "location": 'Herr Wesselstraat 68c',
        "limit": '50'
    }
    const requestOptionsZ = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(params)
    };
    const fetchData = () => {
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

                const dataResult = [];
                let nextID = 1;
                for (let indexData = 0; indexData < dataZ.data.length; ++indexData) {
                    const JsonData = JSON.stringify({
                        "id": nextID++,
                        "name": dataZ.data[indexData].name,
                        "phone": dataZ.data[indexData].phone,
                        "addresess": dataZ.data[indexData].location.address1,
                        "alias": dataZ.data[indexData].alias,
                        "showButtons": true
                    });
                    const myObj = JSON.parse(JsonData);
                    dataResult.push(myObj);
                }
                setPost(dataResult)
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
        setTimeout(() => {
            fetchData()
        }, 2000)
    }, [])

    return (
        <>
            <Table data={postsJob} click={clickhandler} />
        </>
    )
}

export default dataBisnis;
