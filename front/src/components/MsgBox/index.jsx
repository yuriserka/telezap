/* eslint-disable require-jsdoc */
import React from 'react';
import {FormStyle, InputMsg, BoxMsgDiv} from './styles.jsx';

class MsgBox extends React.Component {
  render() {
    return (
      <BoxMsgDiv>
        <FormStyle method="post">
            Nickname: <InputMsg type="text" name="nick" autoComplete="off" />
          { /* eslint-disable-next-line max-len */ }
            Digite uma mensagem: <InputMsg type="text" name="message" autoComplete="off" />
          <InputMsg type="submit" />
        </FormStyle>
      </BoxMsgDiv>
    );
  }
}

export default MsgBox;