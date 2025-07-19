import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";

const validationSchema = Yup.object().shape({
  matricula: Yup.string()
    .trim()
    .required("A matrícula é obrigatório")
    .max(12),
  senha:Yup.string().required("Digite sua senha")
});

const LoginScreen = () => {

  return (
    
    <ScrollView contentContainerStyle={styles.scrollContainer}>

    <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />
        </View>
      
    
        <View style={styles.container}>
        
      
      {/* Formulário de Login */}
      <Formik
        initialValues={{
          matricula:"",
          senha:""}
        }
        validationSchema={validationSchema}
        onSubmit={(values) =>console.log(values)}
      >
        {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        handleBlur,
        }) => (
          <>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.label}>Matrícula: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua matrícula de aluno ou servidor"
                value={values.matricula}
                onChangeText={handleChange("matricula")}
                onBlur={handleBlur("matricula")}
              />
              {touched.matricula && errors.matricula && (
                <Text style={{ color: "red" }}>{errors.matricula}</Text>
              )}

              <Text style={styles.label}>Senha: *</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                secureTextEntry
                value={values.senha}
                onChangeText={handleChange("senha")}
                onBlur={handleBlur("senha")}
              />
              <TouchableOpacity 
                style={styles.button}
                onPress={() => handleSubmit()}
                >
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

      </Formik>
      
   </View>
  
   </ScrollView>
  );
};

const styles = StyleSheet.create({
 
  scrollContainer: {
    flex: 1,
    backgroundColor: "#ECEEEC",
   
  },
  container: {
    alignItems: "center",
    paddingVertical: 150,

  },
  logoContainer: {
    width: "100%",
    backgroundColor: "#E7F6D4",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 40,
    flexDirection: 'row',
    
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#F2F2F2",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#6CB43F",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
