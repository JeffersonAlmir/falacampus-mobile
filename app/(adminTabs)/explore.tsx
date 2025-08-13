import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  FlatList,
  RefreshControl,
  Dimensions
} from "react-native";
import { Provider, Menu, Button } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Yup from "yup";
import { Formik } from "formik";
import DropDownPicker from "react-native-dropdown-picker";
const { width, height } = Dimensions.get('window');

import ModalEditResponse from "@/components/modals/ModalEditResponse";
import ModalEditComment from "@/components/modals/ModalEditComment";
import ModalDelete from "@/components/modals/ModalDelete";
import { IComment } from "@/interface/IComment";
import ResponseAdm from "@/components/response/ResponseAdm";
import CommentComponent from "@/components/comment/Comment";



const validationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .max(50)
    .min(10, "O título tem que ter no mínimo 10 caracteres")
    .required("O título é obrigatório."),

  commentType: Yup.string().required("O tipo de comentário é obrigatório."),
});

const SearchComments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("Buscar por");
  const [comments, setComments] = useState<IComment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [editResponseModalVisible, setEditResponseModalVisible] = useState(false);
  const [responseToEdit, setResponseToEdit] = useState("");
  const [commentWithResponse, setCommentWithResponse] = useState(null);
  const [openCommentType, setOpenCommentType] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [selectedIten, setSelectedIten] = useState({})

  const [menuVisible, setMenuVisible] = useState(false);
  

  const [commentTypeList, setCommentTypeList] = useState([
    { label: "Crítica", value: "Crítica" },
    { label: "Elogio", value: "Elogio" },
    { label: "Sugestão", value: "Sugestão" },
  ]);

  // Carrega os comentários do AsyncStorage
  const loadComments = async () => {
    try {
      const storedComments = await AsyncStorage.getItem("comments");
      if (storedComments) {
        setComments(JSON.parse(storedComments));
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao carregar os comentários.");
    }
  };

  // Função para pesquisar comentários
  const handleSearch = () => {
    console.log("pesquisando...");
    Alert.alert(
      "Pesquisar",
      `Buscando por: ${searchQuery} - Tipo: ${searchType}`
    );
  };

  // Função para atualizar a lista de comentários
  const onRefresh = () => {
    setRefreshing(true);
    loadComments().then(() => setRefreshing(false));
  };

  // Carrega os comentários ao abrir a página
  useEffect(() => {
    loadComments();
  }, []);

  const handleDeleteComment = async (id:string) => {
    const updatedComments = comments.filter((comment) => comment.id !== id);
    setComments(updatedComments);
    await AsyncStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const handleEditComment = (id:string) => {
    const comment = comments.find((c) => c.id === id);
    if (comment) {
      setCommentToEdit(comment);
      setEditedMessage(comment.message);
      setEditedTitle(comment.title);
      setEditModalVisible(true);
    }
  };

  const saveEditedComment = async () => {
    if (!editedMessage.trim()) {
      Alert.alert("Erro", "A mensagem não pode estar vazia.");
      return;
    }

    const updatedComments = comments.map((comment) =>
      comment.id === commentToEdit.id
        ? { ...comment, message: editedMessage, title: editedTitle }
        : comment
    );

    setComments(updatedComments);
    await AsyncStorage.setItem("comments", JSON.stringify(updatedComments));
    setEditModalVisible(false);
    setCommentToEdit(null);
  };

  const handleEditResponse = (id:string) => {
    const comment = comments.find((c) => c.id === id);
    if (comment && comment.response) {
      setResponseToEdit(comment.response);
      setCommentWithResponse(comment);
      setEditResponseModalVisible(true);
    }
  };

  const handleDeleteResponse = async (id:string) => {
    const updatedComments = comments.map((comment) =>
      comment.id === id ? { ...comment, response: "" } : comment
    );
    setComments(updatedComments);
    await AsyncStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const saveEditedResponse = async () => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentWithResponse.id
        ? { ...comment, response: responseToEdit }
        : comment
    );

    setComments(updatedComments);
    await AsyncStorage.setItem("comments", JSON.stringify(updatedComments));
    setEditResponseModalVisible(false);
    setCommentWithResponse(null);
  };

  // escolhe a funçao que vai deletar o objeto
  const handleDeleteAction = () =>  {
    if (!selectedIten) return;
  
    if (selectedIten.action === 'comment') {
      handleDeleteComment(selectedIten.item);

    } else if (selectedIten.action === 'response') {
      handleDeleteResponse(selectedIten.item);

    }
    
    setDeleteModalVisible(false)
  };

  return (
    <Provider>
      <View style={styles.outerContainer}>
        <Image
          source={require("../../assets/images/Fala_campus-logo.png")}
          style={styles.logo}
        />
        <Formik
          initialValues={{
            title: "",
            commentType: "",
          }}
          validationSchema={validationSchema}
          onSubmit={() => handleSearch()}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            values,
            errors,
            touched,
            resetForm,
          }) => (
            <View style={styles.container}>
              <View style={styles.card}>
                <Text style={styles.title}>Buscar Comentários</Text>

                <Text style={styles.label}>Título: *</Text>
                <TextInput
                  style={styles.input}
                  value={values.title}
                  onChangeText={handleChange("title")}
                  placeholder="Digite o título"
                  placeholderTextColor="#333"
                  onBlur={handleBlur("title")}
                />
                {touched.title && errors.title && (
                  <Text style={{ color: "red" }}>{errors.title}</Text>
                )}

                <Text style={styles.label}>Tipo de Comentário: *</Text>
                <DropDownPicker
                  open={openCommentType}
                  value={values.commentType}
                  items={commentTypeList}
                  setOpen={setOpenCommentType}
                  setValue={(callback) => {
                    const newValue = callback(values.commentType);
                    setFieldValue("commentType", newValue);
                  }}
                  setItems={setCommentTypeList}
                  placeholder="Selecione um tipo "
                  onClose={() => setFieldTouched("commentType", false)}
                  style={[styles.input]}
                  dropDownContainerStyle={{ borderColor: "#ccc", zIndex: 1000 }}
                  listMode="SCROLLVIEW"
                />
                {touched.commentType && errors.commentType && (
                  <Text style={{ color: "red" }}>{errors.commentType}</Text>
                )}

                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  <Text style={styles.buttonText}>Pesquisar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>


        <ModalEditResponse
          editModalVisible={editResponseModalVisible}
          setEditModalVisible={() => setEditResponseModalVisible(false)}
          editResponse={responseToEdit}
          setEditResponse={setResponseToEdit}
          handleSaveEdit={saveEditedResponse}
        />

        <ModalEditComment
          editModalVisible={editModalVisible}
          setEditModalVisible={() => setEditModalVisible(false)}
          editTitulo={editedTitle}
          setEditTitulo={setEditedTitle}
          editComment={editedMessage}
          setEditComment={setEditedMessage}
          handleSaveEdit={saveEditedComment}
        />

        <ModalDelete
          modalVisible={deleteModalVisible}
          setModalVisible={() => setDeleteModalVisible(false)}
          handleDelete={ handleDeleteAction}
          modalText={modalText}
        />


        <View style={styles.responseCard}>
          <Text style={styles.responseTitle}>Comentários Enviados</Text>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <CommentComponent
                item={item}
                handleEditComment={handleEditComment}
                setDeleteModalVisible={setDeleteModalVisible}
                setModalText={setModalText}
                setSelectedIten={setSelectedIten}
              
              >
                <ResponseAdm
                    item={item}
                    handleEditResponse={handleEditResponse}
                    setDeleteModalVisible={setDeleteModalVisible}
                    setModalText={setModalText}
                    setSelectedIten={setSelectedIten}

                />

              </CommentComponent>
              
            )}
          />

        </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    color: '#333',
  },
  dropdownContainer: {
    width: '100%',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  dropdownButton: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: 'black',
  },
  searchButton: {
    width: '100%',
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  responseCard: {
    flex: 1,
    marginTop: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  commentItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#eabfb3',
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  responseContainer: {
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#b2dfdb',
    borderRadius: 10,
  },
  responseLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  responseText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#c8e6c9',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },
  editButtonText: {
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: width * 0.035,
    },
  deleteButton: {
    backgroundColor: '#ffe5e5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#b71c1c',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  saveButton:{
    backgroundColor: '#c8e6c9',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginRight: 10,
  },
  saveText:{
    color: '#388e3c',
    fontWeight: 'bold',
    fontSize: width * 0.035
  },
  cancelButton:{
    backgroundColor: '#ffe5e5',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  cancelText:{
    color: '#b71c1c',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default SearchComments;
