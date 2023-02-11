import axios from "axios";
import React, { useEffect, useState } from "react";
import { ProfileInfoCard } from "@/widgets/cards";
import { Link } from "react-router-dom";

export default function ApiProfileCard() {
    const UrlIban = "https://api-ibans.pesanin.com";
    const [postCard, setPostProfileCard] = useState("");
    // TOKEN //
    const fetchData = () => {
        const bodyFormData = {
            email: "ibansyahdienx7@gmail.com",
            password: "asinan1969",
        };
        const requestOptionsToken = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(bodyFormData)
        };
        fetch(`${UrlIban}/v1/token/challange`, requestOptionsToken)
            .then(async responseToken => {
                const isJsonToken = responseToken.headers.get('content-type')?.includes('application/json');
                const dataToken = isJsonToken && await responseToken.json();

                // check for error responseToken
                if (!responseToken.ok) {
                    // get error message from body or default to responseToken status
                    const errorToken = (dataToken && dataToken.msg) || responseToken.status;
                    return Promise.reject(errorToken);
                }

                // AUTH USER BY ID //
                const bodyFormDataUser = {
                    email: dataToken.data.user.email,
                };
                const requestOptionsUser = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': dataToken.data.auth.token_type + ' ' + dataToken.data.auth.access_token
                    },
                    body: JSON.stringify(bodyFormDataUser)
                };
                fetch(`${UrlIban}/v1/auth/profile`, requestOptionsUser)
                    .then(async responseUser => {
                        const isJsonUser = responseUser.headers.get('content-type')?.includes('application/json');
                        const dataUser = isJsonUser && await responseUser.json();

                        // check for error responseUser
                        if (!responseUser.ok) {
                            // get error message from body or default to responseUser status
                            const errorUser = (dataUser && dataUser.msg) || responseUser.status;
                            return Promise.reject(errorUser);
                        }

                        // PROFILE CARD //

                        const bodyFormDataProfileCard = {
                            user_id: dataToken.data.user.id,
                        };
                        const requestOptionsProfileCard = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': dataToken.data.auth.token_type + ' ' + dataToken.data.auth.access_token
                            },
                            body: JSON.stringify(bodyFormDataProfileCard)
                        };
                        fetch(`${UrlIban}/v1/profile/list`, requestOptionsProfileCard)
                            .then(async responseProfileCard => {
                                const isJsonProfileCard = responseProfileCard.headers.get('content-type')?.includes('application/json');
                                const dataProfileCard = isJsonProfileCard && await responseProfileCard.json();

                                // check for error responseProfileCard
                                if (!responseProfileCard.ok) {
                                    // get error message from body or default to responseProfileCard status
                                    const errorProfileCard = (dataProfileCard && dataProfileCard.msg) || responseProfileCard.status;
                                    return Promise.reject(errorProfileCard);
                                }

                                const replacePhone1 = dataProfileCard.data.phone;
                                const replacePhone2 = replacePhone1.replace("(62)", "62");
                                const replacePhone3 = replacePhone2.replace(" ", "");
                                const replacePhone4 = replacePhone3.replace("-", "");
                                const replacePhone5 = replacePhone4.replace("-", "");
                                const Phone = replacePhone5;

                                setPostProfileCard(
                                    <ProfileInfoCard
                                        title="Profile Information"
                                        description={dataProfileCard.data.about}
                                        details={{
                                            Nama: `${dataUser.data.name}`,
                                            "No Handphone": <Link to="#" onClick={() => window.open(`https://wa.me/${Phone}`)}>{dataProfileCard.data.phone}</Link>,
                                            email: <Link to="#" onClick={() => window.open(`mailto:${dataUser.data.email}`)}>{dataUser.data.email}</Link>,
                                            website: <Link to="#" onClick={() => window.open(`${dataProfileCard.data.website}`)}>{dataProfileCard.data.website}</Link>,
                                            lokasi: `${dataProfileCard.data.city}`,
                                            "Sosial Media": (
                                                <div className="flex items-center gap-4">
                                                    <Link to="#" onClick={() => window.open(`https://www.facebook.com/ibansyahdien`)}>
                                                        <i className="fa-brands fa-facebook text-blue-700" />
                                                    </Link>
                                                    <Link to="#" onClick={() => window.open(`https://www.instagram.com/ibansyah_/`)}>
                                                        <i className="fa-brands fa-instagram text-purple-500" />
                                                    </Link>
                                                </div>
                                            ),
                                        }}
                                    />
                                );
                            })
                            .catch(errorProfileCard => {
                                console.error('There was an error!', errorProfileCard);
                            });
                    })
                    .catch(errorUser => {
                        console.error('There was an error!', errorUser);
                    });
            })
            .catch(errorToken => {
                console.error('There was an error!', errorToken);
            });
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            {postCard}
        </>
    );
}