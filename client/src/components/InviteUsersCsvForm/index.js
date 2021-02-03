import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from 'react-dropzone';
import { inviteUsers } from "../../redux/actions/usersActions";

import { InviteUsersCsvFormWrapper, Button, P, DropZoneWrapper, Span } from "./styles";

const InviteUsersCsvForm = () => {
  const [file, setFile] = useState({});
  const { invited } = useSelector(state => state.user);
  const onDrop = useCallback(acceptedFiles => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const dispatch = useDispatch();
  // const history = useHistory();

  const onSubmit = () => {
    dispatch(inviteUsers(file));
  };

  return (
    <InviteUsersCsvFormWrapper>

      {
        invited.length > 0 ?
          (<ul>
            {invited.map(i => <li>{i.email}</li>)}
          </ul>) : (
            <>
              <DropZoneWrapper {...getRootProps()}>
                <input
                  {...getInputProps()}
                />
                {
                  Object.keys(file).length > 0 ?
                    <Span><strong>Selected file: </strong>{file.path}</Span>
                    : null
                }
                {
                  isDragActive ?
                    <P>DroP the files here ...</P> :
                    <P>Drag 'n' drop some files here, or click to select files</P>
                }
              </DropZoneWrapper>

              <Button onClick={() => onSubmit()} >
                Invite users
              </Button>
            </>)
      }

    </InviteUsersCsvFormWrapper >
  );
};

export default InviteUsersCsvForm;
