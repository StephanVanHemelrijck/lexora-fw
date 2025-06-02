import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Language, UserAssessment } from '@lexora/types';
import { useLanguagesStore } from '@/stores/useLanguagesStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';

export default function Page() {
  const navigation = useNavigation();
  const { languageId } = useLocalSearchParams<{ languageId: string }>();
  const { getLanguageById } = useLanguagesStore();
  const [language, setLanguage] = useState<Language>();
  const { user } = useAuthStore();
  const [userAssessment, setUserAssessment] = useState<UserAssessment>();

  useEffect(() => {
    console.log('assessment: ', userAssessment);
  }, [userAssessment]);

  useEffect(() => {
    if (!user || !language) return;

    console.log(user, language.id);
    const resolve = async () => {
      try {
        const UA = await api.userAssessment.getActiveOrCreate(
          user.accessToken,
          language.id
        );

        setUserAssessment(UA);
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    resolve();
  }, [user, language]);

  useEffect(() => {
    if (!languageId) return;

    async function fetchLanguage() {
      try {
        const lang = await getLanguageById(languageId);
        setLanguage(lang);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }

    fetchLanguage();
  }, [languageId, , getLanguageById]);

  useEffect(() => {
    if (!language) return;
    navigation.setOptions({ title: `${language.name} - Assessment` });
  }, [language, navigation]);

  return (
    <View>
      <Text>Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
