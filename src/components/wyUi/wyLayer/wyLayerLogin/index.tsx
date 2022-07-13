import React from "react"; console
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { Button, Checkbox, Input } from "antd";
import { MobileOutlined, LockOutlined } from "@ant-design/icons";

export default function WyLayerLogin() {
  return (
    <div>
      <div className="login-phone modal-content">
        <div className="modal-wrap">
          <Form>
            <FormItem >
              <Input prefix={<MobileOutlined />} />
            </FormItem>
            <FormItem>
              <Input.Password prefix={<LockOutlined />} />
            </FormItem>
            <FormItem>

              <Checkbox>记住密码</Checkbox>
              <Button>登陆</Button>
            </FormItem>
          </Form>
        </div>
      </div>

      <div className="m-footer clearfix">
      </div>
    </div>
  )
}