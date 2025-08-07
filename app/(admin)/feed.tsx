import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IComment } from "@/interface/IComment";

const { width, height } = Dimensions.get('window');


export default function Feed() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchComments = async () => {
    try {
      const existingComments = await AsyncStorage.getItem('comments');
      if (existingComments) {
        setComments(JSON.parse(existingComments));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchComments();
}, []);

  const sortedComments = [...comments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  
  return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />
            <Text style={styles.topTitle}>Feed de Comentários</Text>
            {loading ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando comentários...</Text>
            ) : comments.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum Comentário encontrado.</Text>
            ) : (
                <View>
                    {sortedComments // Ordena do mais recente para o mais antigo
                    .map((comment) => (
                        <View key={comment.id} style={styles.messageCard}>
                            <Text><Text style={styles.labelBold}>Autor:</Text> <Text style={styles.value}>{comment.author}</Text></Text>
                            <Text><Text style={styles.labelBold}>Título:</Text> <Text style={styles.value}>{comment.title}</Text></Text>
                            <Text><Text style={styles.labelBold}>Tipo:</Text> <Text style={styles.value}>{comment.type}</Text></Text>
                            <Text><Text style={styles.labelBold}>Departamento:</Text> <Text style={styles.value}>{comment.department}</Text></Text>
                            <Text style={styles.labelBold}>Mensagem:</Text>
                            <Text style={styles.messageBox}>{comment.message}</Text>

                            <View style={styles.cardFooter}>
                                <Text
                                style={[
                                    styles.cardStatus,
                                    comment.status === 'Respondido' ? styles.statusAnswered : styles.statusPending,
                                ]}
                                >
                                {comment.status || 'Pendente'}
                                </Text>
                                <Text style={styles.cardDate}>
                                    Enviado em: {new Date(comment.date).toLocaleString('pt-BR')}
                                </Text>
                            </View>                            
                        </View>
                    ))}
                </View>   
            )}
            <Text style={styles.footer}>
              Projeto Fala Campus Mobile - IFPB - Guarabira 2025
            </Text>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    paddingBottom: 100, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: "contain",
    marginBottom: 20
  },
  topTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  card: {
    backgroundColor: '#fff',
    padding: width * 0.05,
    margin: width * 0.05,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    height: height * 0.1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.02,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginBottom: height * 0.02,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eabfb3',
    borderRadius: 10,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageBox: {
    width: "100%",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 20,
    color: "#333",
    
  },
  cardAuthor: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: 4,
  },
  cardTitle:{
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: 4,
  },
  cardType:{
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  cardMessage: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  statusPending: {
    backgroundColor: '#ffe5b4',
    color: '#a67c52',
  },
  statusAnswered: {
    backgroundColor: '#c8e6c9',
    color: '#388e3c',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  replyButtonText: {
    fontSize: width * 0.035,
    color: '#333',
    fontWeight: 'bold',
  },
  labelBold: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#111',
  },
  value: {
    fontWeight: 'normal',
    color: '#444',
    fontSize: 15,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: "#666",
  }
});
