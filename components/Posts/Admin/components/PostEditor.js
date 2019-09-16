import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { css } from '@emotion/core';
import { connect } from 'react-redux';
import { getPlatforms } from 'store/platform/actions';
import { getTags } from 'store/bot/actions';
import { getUsers } from 'store/user/actions';
import { Button } from 'components/default';
import { Textarea, Input } from 'components/default/inputs';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0 10px 0;
`;

const InputWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  &:first-of-type {
    margin-right: 10px;
  }
  &:last-of-type {
    margin-left: 10px;
  }
`;

const TextareaWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const StatusButton = styled(Button)`
  text-transform: uppercase;
  min-height: 38px;
`;

const Error = styled.span`
  font-size: 15px;
  text-align: center;
  color: ${ props => props.theme.colors.darkishPink };
`;

const selectStyles = {
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px',
    borderColor: '#ced4da'
  })
};

const inputStyles = {
  container: css`
    &:first-of-type {
      margin-right: 10px;
    }
    &:last-of-type {
      margin-left: 10px;
    }  
  `,
};

const PostEditor = ({
  type, post, onSubmit, onClose,
}) => {

  const [title, setTitle] = useState(post ? post.title : '');
  const [content, setContent] = useState(post ? post.content : '');

  const [error, setError] = useState(null);

  const toOptions = item => {
    return({
      ...item,
      value: typeof item === 'object' ? ( item.name || item.id) : item,
      label: typeof item === 'object' ? (item.email ? item.email + ' | ' + item.name : item.name) : item
    });
  };

  useEffect(() => {

  }, []);

  const submit = () => {
    if(!title) {
      setError('You must fill in required fields marked by \'*\'');
    } else {
      setError(null);
      onSubmit({
        title, content
      });
    }
  };

  return(
    <>
      <FormContainer>
        <Row>
          <Input type={'text'} label={'Post Title *'} value={title} styles={inputStyles}
            onChange={e => setTitle(e.target.value)}
          />
        </Row>
        <Row>
          <Textarea label={'Post Content'} rows={10} value={content}
            onChange={e => setContent(e.target.value)}
          />
        </Row>
        { error && <Error>{ error }</Error> }
      </FormContainer>
      <Buttons>
        <Button type={'primary'} onClick={submit}>{ type === 'add' ? 'Add' : 'Update' }</Button>
        <Button type={'danger'} onClick={onClose}>Cancel</Button>
      </Buttons>
    </>
  );
};

PostEditor.propTypes = {
  type: PropTypes.oneOf(['edit', 'add']).isRequired,
  post: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PostEditor);
