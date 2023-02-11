import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { projectsData } from "@/data";
import React, { useEffect, useState } from "react";

import useDocumentTitle from "@/components/useDocumentTitle";
import ApiProfileIban from "@/api/Iban/ProfileIban";
import ApiProfileCard from "@/api/Iban/ProfileCardIban";

export function Home() {
  useDocumentTitle('Home | 62 Teknologi Senior Frontend Developer - Test');

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url(https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-blue-500/50" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <ApiProfileIban />
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-12 xl:grid-cols-1">
            <ApiProfileCard />
          </div>
        </CardBody>
      </Card >
    </>
  );
}

export default Home;
