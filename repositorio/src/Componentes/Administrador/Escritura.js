import React from 'react';
import { Upload, message, Button } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class Escritura extends React.Component {
    render(){
        return(
            <div style={{width:"90%", height:"50%"}}>
                <Dragger {...props} style={{width:"100%"}}>
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click o arrastra para cargar un archivo</p>
                    <p className="ant-upload-hint">
                    Recuerda que solo pueden subir archivos con extensión .csv, .txt o .xlsx
                    </p>
                </Dragger>
                <Button type="primary" icon={<UploadOutlined />} block>
                  Subir
                </Button>
            </div>
        );
    }
}

export default Escritura;