import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=ccc&color=fff';

const User = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState(DEFAULT_AVATAR);

    useEffect(() => {
        //buscar dados do usuário do AsyncStorage
        const fetchUser = async () => {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                setName(user.name || '');
                setEmail(user.email || '');
                setPhoto(user.photo || DEFAULT_AVATAR);
            }
        };
        fetchUser();
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/Fala_campus-logo.png')} style={styles.logo} />
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <Image source={{ uri: photo }} style={styles.avatar} />
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
        marginTop: 20,
        marginBottom: 20,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
   
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    email: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        color: '#666',
    },
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
        backgroundColor: '#eee',
    },
});

export default User;
