import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { IComment } from '@/interface/IComment';

const { width, height } = Dimensions.get('window');

export default function Respostas() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Buscar as mensagens salvas no AsyncStorage ao carregar a página
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
      <View style={styles.header}>
        <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.topTitle}>Mensagens Recebidas</Text>
      {loading ? (
  <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando mensagens...</Text>
) : comments.length === 0 ? (
  <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma mensagem encontrada.</Text>
) : (
  <View style={styles.card}>
    {sortedComments // Ordena do mais recente para o mais antigo
        .map((comment) => (
        <View key={comment.id} style={styles.messageCard}>
          <Text style={styles.cardAuthor}>Autor: {comment.author}</Text>
          <Text style={styles.cardDate}>
            Enviado em: {new Date(comment.date).toLocaleString('pt-BR')}
          </Text>
          <Text style={styles.cardMessage}>Mensagem: {comment.message}</Text>
          <View style={styles.cardFooter}>
            <Text
              style={[
                styles.cardStatus,
                comment.status === 'Respondido' ? styles.statusAnswered : styles.statusPending,
              ]}
            >
              {comment.status || 'Pendente'}
            </Text>
            {comment.status !== 'Respondido' && (
              <TouchableOpacity
                style={styles.replyButton}
                 onPress={() =>
                      router.push(`/screens/responder-mensagem?commentId=${comment.id}`)
                    }
              >
                <Text style={styles.replyButtonText}>Responder</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
  </View>
)}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
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
    width: width * 0.3,
    height: height * 0.05,
    resizeMode: 'contain',
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
  cardAuthor: {
    fontWeight: 'bold',
    fontSize: width * 0.045,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: width * 0.035,
    color: '#555',
    marginBottom: 8,
  },
  cardMessage: {
    fontSize: width * 0.04,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardStatus: {
    paddingVertical: 4,
    paddingHorizontal: 10,
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
});