import { Link, router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';

export default function App() {
  return (
    
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      
      {/* Cabeçalho: Logo Fala Campus à esquerda, Login à direita */}
      <View style={styles.header}>
        <Image source={require('../assets/images/Fala_campus-logo.png')} style={styles.logo} />
        <TouchableOpacity
          onPress={()=>router.push('/screens/login')}
          >
          <Text>Login</Text>
          
          
        </TouchableOpacity>
      </View>

      {/* Texto introdutório em fundo claro */}
      <View style={styles.introContainer}>
        <Text style={styles.introText}>
          Este espaço é destinado a toda a comunidade acadêmica, onde todos poderão propor sugestões, 
          realizar críticas e elogios, relacionados ao Instituto Federal da Paraíba, Campus Guarabira - PB.
        </Text>
        <Text style={styles.introBullet}>
          * Faça login no sistema para participar
        </Text>
      </View>

      {/* Imagem da mulher posicionada entre o texto introdutório e o contêiner verde */}
      <Image source={require('../assets/images/img-01.png')} style={styles.womanImage} resizeMode="contain" />

      {/* Contêiner verde musgo com texto */}
      <View style={styles.darkGreenContainer}>
        {/* Texto dentro do contêiner */}
        <View style={styles.textContainer}>
          <Text style={styles.projectText}>
            Projeto desenvolvido para a disciplina de Programação Para Dispositivos Móveis 
            com o Professor Elenilson Vieira, no 5º Período do Sistemas Para Internet do IFPB, 
            Campus Guarabira - PB.
          </Text>

          <Text style={styles.devsTitle}>Desenvolvedores:</Text>
          <Text style={styles.devsText}>• Marcelo Felipe da Silva</Text>
          <Text style={styles.devsText}>• Lívia Freitas de Lucena</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#a5d6a7', // Verde menta
    
  },
  

  /* Cabeçalho */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff', // Branco
    paddingHorizontal: 16,
    paddingVertical: 40, // Mais espesso
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    borderRadius: 10,
    elevation: 3, // Sombra
  },
  logo: {
    width: 120,
    height: 40,
  },

  /* Área de introdução (fundo claro) */
  introContainer: {
    backgroundColor: '#a5d6a7', // Branco
    paddingHorizontal: 16,
    paddingVertical: 16,
    margin: 16,
    borderRadius: 10,
    elevation: 3, // Sombra
    width: '90%',
    alignSelf: 'center', // Centralizado
  },
  introText: {
    fontSize: 18,
    color: '#fff', // Texto preto
    marginBottom: 8,
    textAlign: 'justify',
  },
  introBullet: {
    fontSize: 16,
    color: '#fff', // Verde menta
    fontWeight: 'bold',
  },

  /* Imagem da mulher */
  womanImage: {
    width: 120,
    height: 180,
    alignSelf: 'center', // Centralizada
    marginTop: 5, // Espaço após o texto introdutório
    marginBottom: -40, // Colada no contêiner verde
  },

  /* Contêiner verde musgo */
  darkGreenContainer: {
    backgroundColor: 'green', // Verde musgo
    paddingHorizontal: 16,
    paddingVertical: 20,
    margin: 16,
    borderRadius: 10,
    elevation: 3, // Sombra
    width: '90%',
    alignSelf: 'center', // Centralizado
    marginTop: 40, // Espaço para a imagem
  },
  textContainer: {
    marginTop: 20, // Espaço interno
  },
  projectText: {
    color: '#fff', // Texto branco
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'justify',
  },
  devsTitle: {
    color: '#fff', // Texto branco
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
  },
  devsText: {
    color: '#fff', // Texto branco
    fontSize: 16,
    marginBottom: 2,
  },
});