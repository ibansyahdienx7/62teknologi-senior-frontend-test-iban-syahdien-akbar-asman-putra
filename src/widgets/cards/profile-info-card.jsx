import PropTypes from "prop-types";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
import autoAnimate from "@formkit/auto-animate";
import React, { useEffect, useRef, useState } from "react";
export function ProfileInfoCard({ title, description, details, action }) {
    const [readMore, setReadMore] = useState(false);
    const Desc = description;
    const FinalDeskripsi = Desc.replace("\n\n", "");
    return (
        <Card color="transparent" shadow={false}>
            <CardHeader
                color="transparent"
                shadow={false}
                floated={false}
                className="mx-0 mt-0 mb-4 flex items-center justify-between gap-4"
            >
                <Typography variant="h6" color="blue-gray">
                    {title}
                </Typography>
                {action}
            </CardHeader>
            <CardBody className="p-0">
                <div className="full-width p-0 m-0">
                    <div className="page-width p-0 m-0">
                        <div className={readMore ? "expanded p-0 m-0" : "expander p-0 m-0"}>
                            <div className="inner-bit p-0 m-0">
                                {description && (
                                    <Typography
                                        variant="small"
                                        className="font-normal text-blue-gray-500 break-all prose prose-a:text-blue-600 hover:prose-a:text-blue-500"
                                        display="block"
                                        component="pre"
                                    >
                                        {FinalDeskripsi}
                                    </Typography>
                                )}

                            </div>
                        </div>
                        <div className="button expand-toggle" onClick={() => setReadMore(!readMore)}>
                            {readMore ? "Tampilkan Lebih Sedikit" : "Tampilkan Lebih Banyak"}
                        </div>

                    </div>
                </div>
                {description && details ? (
                    <hr className="my-8 border-blue-gray-50" />
                ) : null}
                {details && (
                    <ul className="flex flex-col gap-4 p-0">
                        {Object.keys(details).map((el, key) => (
                            <li key={key} className="flex items-center gap-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-semibold capitalize"
                                >
                                    {el}:
                                </Typography>
                                {typeof details[el] === "string" ? (
                                    <Typography
                                        variant="small"
                                        className="font-normal text-blue-gray-500"
                                    >
                                        {details[el]}
                                    </Typography>
                                ) : (
                                    details[el]
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </CardBody>
        </Card>
    );
}

ProfileInfoCard.defaultProps = {
    action: null,
    description: null,
    details: {},
};

ProfileInfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.node,
    details: PropTypes.object,
};

ProfileInfoCard.displayName = "/src/widgets/cards/profile-info-card.jsx";

export default ProfileInfoCard;
