import React, { useEffect } from "react";
import { Title } from "./App";

interface PageProps {
  title: Title
  component: () => JSX.Element
}

export default function Page(props: PageProps) {

  const PageComponent = props.component

  useEffect(() => {
    document.title = props.title
  }, [props.title])

  return (
    <PageComponent />
  )
}