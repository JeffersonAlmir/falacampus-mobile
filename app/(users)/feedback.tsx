import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Provider,} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from "yup";
import { Formik } from "formik";
import DropDownPicker from 'react-native-dropdown-picker';




const validationSchema = Yup.object().shape({
    title: Yup.string()
        .trim()
        .max(50) 
        .min(10, "O título tem que ter no mínimo 10 caracteres")
        .required("O título é obrigatório."),
    message: Yup.string()
        .trim()
        .min(10, "A mensagem tem que ter no mínimo 10 caracteres")
        .required("A mensagem é obrigatória.").max(255),
    department:Yup.string()
        .required("O Departamento é obrigatório."),
    commentType:Yup.string()
        .required("O tipo de comentário é obrigatório."),
    author:Yup.string()
        .trim()
        .min(10, "O nome tem que ter no mínimo 10 caracteres")
        .required("O nome do autor é obrigatório.").max(50),

});

const CommentRegistration = () => {
    const [departments, setDepartments] = useState<{ label: string; value: string }[]> ([])
    const [openDepartment, setOpenDepartment] = useState(false);
    const [openCommentType, setOpenCommentType] = useState(false);
    const [commentTypeList, setCommentTypeList] = useState([
        { label: "Crítica", value: "Crítica" },
        { label: "Elogio", value: "Elogio" },
        { label: "Sugestão", value: "Sugestão" }
    ]);


    // Data fixa para o dia atual
    const currentDate = new Date().toLocaleDateString('pt-BR');

    const handleSave = async (values:{title:string, message:string, department:string, 
        commentType:string, author:string}, resetForm:() => void) => {

        const newComment = {
            id: Date.now().toString(),
            title: values.title,
            message: values.message ,
            author: values.author,
            department: values.department,
            date: new Date().toISOString(), // Salva a data real do sistema
            type: values.commentType,
            status: 'Pendente'
        };

        try {
            const existingComments = await AsyncStorage.getItem('comments');
            const comments = existingComments ? JSON.parse(existingComments) : [];
            comments.push(newComment);
            await AsyncStorage.setItem('comments', JSON.stringify(comments));

            Alert.alert('Sucesso', 'Comentário cadastrado com sucesso!');
            Keyboard.dismiss();
            resetForm();
        } catch (error) {
            console.log(error);
        }
    };


    const getDepartments = async () =>{
       try {
      const keys = await AsyncStorage.getAllKeys();
      const departmentKeys = keys.filter((key) => key.startsWith("department_"));
      const departmentsData = await AsyncStorage.multiGet(departmentKeys);
      const departmentsList = departmentsData.map(([key, value]) => JSON.parse(value!));

      //formato necessário para o DropDownPicker
      const formattedList = departmentsList.map((item) => ({
        label: item.nome, 
        value: item.nome, 
      }));

      setDepartments(formattedList);
    } catch (error) {
      console.log(error);
    }
    }
    
    useEffect(()=>{
        getDepartments()
    },[])
    return (
        
        <Provider>
            <View style={styles.containerLogo}>

                <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />
            </View>
            <ScrollView>

            <View style={styles.container}>

                <View style={styles.card}>
                    
                    <Text style={styles.title}>Cadastro de Comentário</Text>
                        
                    <Formik
                        initialValues={{
                            title: "",
                            message: "",
                            department: "",
                            commentType: "",
                            author: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => handleSave(values, resetForm)}
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
                            <>
                           

                            <Text style={styles.label}>Departamento: *</Text>
                            <DropDownPicker
                            
                                open={openDepartment}
                                value={values.department}
                                items={departments}
                                setOpen={setOpenDepartment} 
                                setValue={(callback) => {
                                    const newValue = callback(values.department);
                                    setFieldValue("department", newValue);    
                                }}
                                setItems={setDepartments}
                                placeholder="Selecione um departamento"
                                onClose={() => setFieldTouched("department", false)}  
                                style={[styles.input]}
                                dropDownContainerStyle={{ borderColor: "#ccc"}}
                                listMode="SCROLLVIEW"
                                    
                            />
                            {touched.department && errors.department && (
                                <Text style={{ color: "red" }}>{errors.department}</Text>
                            )}
                            
                            
                            <Text style={styles.label}>Título: *</Text>
                            <TextInput
                                style={styles.input}
                                value={values.title}
                                onChangeText={handleChange("title")}
                                onBlur={handleBlur("title")}
                                placeholder="Digite o título do comentário"
                                placeholderTextColor="#333"
                            />
                            {touched.title && errors.title && (
                                <Text style={{ color: "red" }}>{errors.title}</Text>
                            )}

                            <Text style={styles.label}>Mensagem: *</Text>
                            <TextInput
                                style={styles.input}
                                value={values.message}
                                onChangeText={handleChange("message")}
                                onBlur={handleBlur("message")}
                                placeholder="Digite a sugestão, crítica ou elogio"
                                placeholderTextColor="#333"
                                multiline
                            />
                            {touched.message && errors.message && (
                                <Text style={{ color: "red" }}>{errors.message}</Text>
                            )}

                            <Text style={styles.label}>Data: *</Text>
                            <View style={styles.input}>
                                <Text>{currentDate}</Text>
                            </View>

                            <Text style={styles.label}>Autor do comentário: *</Text>
                            <TextInput
                                style={styles.input}
                                value={values.author}
                                onChangeText={handleChange("author")}
                                onBlur={handleBlur("author")}
                                placeholder="Digite seu nome"
                                placeholderTextColor="#333"
                            />
                            {touched.author && errors.author && (
                                <Text style={{ color: "red" }}>{errors.author}</Text>
                            )}

                           

                            <View style={{ zIndex: openCommentType ? 3000 : 0 }}>

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
                                    placeholder="Selecione um comentário"
                                    onClose={() => setFieldTouched("commentType", false)}    
                                    style={[styles.input]}
                                    dropDownContainerStyle={{ borderColor: "#ccc" }}
                                    listMode="SCROLLVIEW"
                                />
                                {touched.commentType && errors.commentType && (
                                    <Text style={{ color: "red" }}>{errors.commentType}</Text>
                                )}
                            </View>


                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.saveButton} onPress={()=>handleSubmit()}>
                                <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => resetForm()}
                                >
                                <Text style={styles.buttonText}>Limpar</Text>
                                </TouchableOpacity>
                            </View>
                            </>
                        )}
                    </Formik>
                    

                    
                </View>
            </View>
            </ScrollView>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    containerLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        
    },

    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 20,

    },
    card: {
        backgroundColor: 'white',
        width: '90%',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#FFF',
        marginTop: 5,
        color: '#333',
    },
    dropdownContainer: {
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    dropdownButton: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 5,
        width: 150,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dropdownButtonText: {
        fontSize: 14,
        color: 'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default CommentRegistration;
