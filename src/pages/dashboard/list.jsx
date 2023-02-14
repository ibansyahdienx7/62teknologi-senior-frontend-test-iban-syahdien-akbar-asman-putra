import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import useDocumentTitle from "@/components/useDocumentTitle";
import React from "react";
import DataBisnis from "@/data/dataListBusiness";

export function ListBusiness() {
  useDocumentTitle("List Business | 62 Teknologi Senior Frontend Developer - Test");
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 w-100">
      <Card>
        <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            List Business
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <DataBisnis />
        </CardBody>
      </Card>
    </div>
  );
}

export default ListBusiness;
