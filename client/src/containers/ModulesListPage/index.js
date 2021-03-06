import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllModules, deleteModule } from '../../redux/actions/modulesActions';

import Layout from '../Layout';
import Loading from '../../components/Loading';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import UpdateModuleForm from '../../components/UpdateModuleForm';
import FilterBar from '../../components/FilterBar';
import AddLectureForm from '../../components/AddLectureForm';
import { H1, ButtonCancel, ButtonConfirm, ConfirmationWrapper, } from './styles';
import { Button, ButtonsRow } from '../UserListPage/styles';
import CreateModule from '../../components/CreateModule';

const ModuleListPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const module = useSelector(state => state.module);
  const { loading, isAuth, user } = useSelector(state => state.auth);
  const [selected, setSelected] = useState(null);
  // const [adminFilter, setAdminFilter] = useState({
  //   name: "All Users",
  //   value: ""
  // });
  // const [roleFilter, setRoleFilter] = useState({
  //   name: "All Roles",
  //   value: ""
  // });
  const [rows, setRows] = useState([]);
  const editModalRef = useRef();
  const deleteModalRef = useRef();
  const addLectureModalRef = useRef();
  const createModuleRef = useRef();

  useEffect(() => {
    dispatch(getAllModules());
  }, []);

  if (user && user.companyName) {
    history.push('/empleos');
    return null;
  }

  useEffect(() => {
    setRows(
      module.modules
        // .filter(u => {
        //   if (!roleFilter.value) {
        //     return true;
        //   }
        //   return u.role === roleFilter.value;
        // })
        // .filter(u => {
        //   if (adminFilter.value === "") {
        //     return true;
        //   }
        //   return u.isSuperAdmin === adminFilter.value;
        // })
        .map(m => ({
          _id: m._id,
          title: m.title,
          description: m.description
        }))
    );
  }, [module.modules]);

  const handleUpdateModule = (id) => {
    const [selectedModule] = module.modules.filter(m => {
      if (m._id === id)
        return true;
      return false;
    });
    setSelected(selectedModule);
    editModalRef.current.openModal();
  };

  const handleDeleteModule = (id) => {
    const [selectedModule] = module.modules.filter(m => {
      if (m._id === id)
        return true;
      return false;
    });
    setSelected(selectedModule);
    deleteModalRef.current.openModal();
  };

  const handleAddLecture = (id) => {
    const [selectedModule] = module.modules.filter(m => {
      if (m._id === id)
        return true;
      return false;
    });
    setSelected(selectedModule);
    addLectureModalRef.current.openModal();
  };

  if (loading || module.loading)
    return <Loading />;

  if (!isAuth) {
    history.push("/login");
    return null;
  }

  if (user && !user.isSuperAdmin) {
    history.push("/");
    return null;
  }

  const columns = [
    {
      id: "1",
      text: "Title",
      name: "title"
    },
    {
      id: "2",
      text: "Description",
      name: "description"
    },
    {
      id: "3",
      text: "Acciones",
      name: "actions"
    }
  ];

  const actions = [
    {
      handleClick: (id) => handleUpdateModule(id),
      icon: <i class="fas fa-pencil-alt"></i>
    },
    {
      handleClick: (id) => handleDeleteModule(id),
      icon: <i class="fas fa-trash-alt"></i>
    },
    {
      handleClick: (id) => handleAddLecture(id),
      icon: <i class="fas fa-plus"></i>
    }
  ];

  // const filters = [
  //   {
  //     name: "Roles",
  //     setFilter: setRoleFilter,
  //     selectedFilter: roleFilter,
  //     options: [
  //       {
  //         name: "All Roles",
  //         value: ""
  //       },
  //       {
  //         name: "Guess",
  //         value: "guest"
  //       },
  //       {
  //         name: "Student",
  //         value: "student"
  //       },
  //       {
  //         name: "Instructor",
  //         value: "instructor"
  //       },
  //     ]
  //   },
  //   {
  //     name: "Users",
  //     setFilter: setAdminFilter,
  //     selectedFilter: adminFilter,
  //     options: [
  //       {
  //         name: "All Users",
  //         value: ""
  //       },
  //       {
  //         name: "Super Admins",
  //         value: true
  //       },
  //       {
  //         name: "Regular Users",
  //         value: false
  //       },
  //     ]
  //   },
  // ];

  return (
    <Layout>
      <FilterBar filters={[]} />
      <ButtonsRow>
        <Button onClick={() => createModuleRef.current.openModal()}>Crear módulo</Button>
      </ButtonsRow>
      <Table columns={columns} rows={rows} actions={actions} style={{ "grid-template-columns": "1fr 1fr 1fr" }} />
      <Modal ref={editModalRef}>
        <H1>Editar Module</H1>
        <UpdateModuleForm modalRef={editModalRef} moduleData={selected} />
      </Modal>
      <Modal ref={deleteModalRef}>
        {
          selected ? (
            <ConfirmationWrapper>
              <H1>Borrando {selected.title} module</H1>
              <span>Estás seguro que deseas borrar este módulo?</span>
              <ButtonConfirm onClick={() => dispatch(deleteModule(selected._id))}>Confirmar</ButtonConfirm>
              <ButtonCancel onClick={() => deleteModalRef.current.closeModal()}>Cancelar</ButtonCancel>
            </ConfirmationWrapper>
          ) : null
        }
      </Modal>
      <Modal ref={addLectureModalRef}>
        <H1>Agregando nueva clase</H1>
        <AddLectureForm modalRef={addLectureModalRef} moduleData={selected} />
      </Modal>
      <Modal ref={createModuleRef}>
        <H1>Creando módulo</H1>
        <CreateModule />
      </Modal>
    </Layout>
  );
};

export default ModuleListPage;
