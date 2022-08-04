import React, { useState } from "react";
import { FolderAddOutlined } from "@ant-design/icons";
import styles from "./index.module.less"
import { LikeSongParams, SongSheet, UserSheet } from "../../../../types/GlobalTypes";
import { Avatar, Button, List } from "antd";
import { Formik } from "formik";
import { Form, FormItem, Input, SubmitButton } from "formik-antd";

interface WyLayerLikeProps {
  sheet: UserSheet | null;
  likeId: string;
  onLikeSong: (args: LikeSongParams) => Promise<void>;
  onCreateSheet: (sheetName: string) => Promise<void>
}

interface NewListForm {
  listName: string;
}

interface ErrorForm {
  listName?: string;
}

export default function WyLayerLike(props: WyLayerLikeProps) {

  const [creating, setCreating] = useState<boolean>(false)

  const initialValues: NewListForm = { listName: '' }

  const handleSubmit = (value: NewListForm) => {
    console.log(value)
    props.onCreateSheet(value.listName)
  }

  const renderListItem = (item: SongSheet) => {
    return (
      <List.Item className={styles.listItem} onClick={() => { props.onLikeSong({ pid: item.id.toString(), tracks: props.likeId }) }}>
        <List.Item.Meta
          avatar={<Avatar src={item.coverImgUrl} />}
          title={<span>{item.name}</span>}
          description={`${item.trackCount}`}
        />
      </List.Item>
    )
  }

  return (

    <div className={styles.like}>
      {
        !creating ? (
          <div className={styles.sheetList}>
            <div className={styles.header} onClick={() => { setCreating(true) }}>
              {/**
         * problem:
         * height is not working for i tag, and the i tag will have a height which 
         * I don't know where the height is coming from.
         */}
              <i><FolderAddOutlined /></i>
              <span className={styles.headerText}>新建歌单</span>
            </div>
            <List dataSource={props.sheet?.self} renderItem={item => renderListItem(item)} />
          </div >
        ) : (

          <div className={styles.createSheet}>
            <Formik
              initialValues={initialValues}
              onSubmit={(values, actions) => {
                //Cannot submit if entered value does not meet validation criteria
                actions.setSubmitting(false)
                handleSubmit(values)
              }}
              validate={values => {
                const errors: ErrorForm = {}
                if (values.listName.length === 0) {
                  errors.listName = '请输入歌单名称'
                }
                return errors
              }}
            >
              <Form >
                <FormItem label="歌单名" name="listName" hasFeedback >
                  <Input name="listName" placeholder="请填写歌单名称" />
                </FormItem>
                <div className={styles.btns}>
                  <Button className={styles.btnBack} onClick={() => { setCreating(false) }}>返回</Button>
                  <SubmitButton type="primary" >新建</SubmitButton>
                </div>
              </Form>
            </Formik>
          </div>
        )
      }
    </div>
  )
}