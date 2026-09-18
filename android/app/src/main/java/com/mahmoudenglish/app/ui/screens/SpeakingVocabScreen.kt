package com.mahmoudenglish.app.ui.screens

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.mahmoudenglish.app.model.VocabWord
import com.mahmoudenglish.app.ui.theme.*
import com.mahmoudenglish.app.utils.TextToSpeechHelper

@Composable
fun SpeakingVocabScreen(
    words: List<VocabWord>,
    onToggleFavorite: (String) -> Unit,
    onDeleteWord: (String) -> Unit,
    tts: TextToSpeechHelper
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("الكل") }
    var isFlashcardMode by remember { mutableStateOf(false) }
    var currentFlashcardIndex by remember { mutableStateOf(0) }
    var isCardFlipped by remember { mutableStateOf(false) }

    val categories = listOf("الكل", "المنزل والأشياء", "طعام وشراب", "العمل والدراسة", "السفر والمواصلات", "المفضلة")

    val filteredWords = words.filter { word ->
        val matchesCategory = when (selectedCategory) {
            "الكل" -> true
            "المفضلة" -> word.isFavorite
            else -> word.category == selectedCategory
        }
        val matchesSearch = word.english.contains(searchQuery, ignoreCase = true) ||
                word.arabic.contains(searchQuery, ignoreCase = true)
        matchesCategory && matchesSearch
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Search & View Mode Switcher
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text(text = "ابحث بالإنجليزية أو العربية...", fontSize = 12.sp) },
                leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = null) },
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.weight(1f),
                singleLine = true
            )

            // Flashcards Mode Toggle Button
            Button(
                onClick = {
                    isFlashcardMode = !isFlashcardMode
                    isCardFlipped = false
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isFlashcardMode) Emerald800 else MaterialTheme.colorScheme.surfaceVariant
                ),
                shape = RoundedCornerShape(16.dp),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 10.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Style,
                    contentDescription = null,
                    tint = if (isFlashcardMode) Color.White else Stone700,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = if (isFlashcardMode) "قائمة" else "بطاقات",
                    fontSize = 12.sp,
                    color = if (isFlashcardMode) Color.White else Stone700,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // Category Pills
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(categories) { cat ->
                val isSelected = selectedCategory == cat
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = if (isSelected) Emerald800 else MaterialTheme.colorScheme.surfaceVariant,
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .clickable { selectedCategory = cat }
                ) {
                    Text(
                        text = cat,
                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                        fontSize = 11.sp,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                    )
                }
            }
        }

        // Content: Either Flashcard Mode or List Mode
        if (isFlashcardMode) {
            if (filteredWords.isNotEmpty()) {
                val safeIndex = currentFlashcardIndex.coerceIn(0, filteredWords.lastIndex)
                val currentWord = filteredWords[safeIndex]

                val rotation by animateFloatAsState(
                    targetValue = if (isCardFlipped) 180f else 0f,
                    animationSpec = tween(durationMillis = 400),
                    label = "flip"
                )

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Card(
                        shape = RoundedCornerShape(28.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(360.dp)
                            .graphicsLayer {
                                rotationY = rotation
                                cameraDistance = 8 * density
                            }
                            .clickable {
                                isCardFlipped = !isCardFlipped
                                if (!isCardFlipped) {
                                    tts.speakEnglish(currentWord.english)
                                } else {
                                    tts.speakArabic(currentWord.arabic)
                                }
                            }
                    ) {
                        if (rotation <= 90f) {
                            // Front of card (English)
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(20.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(text = "بطاقة ${safeIndex + 1} من ${filteredWords.size}", fontSize = 11.sp, color = Stone400)
                                    Text(text = currentWord.iconEmoji ?: "✨", fontSize = 24.sp)
                                }

                                if (!currentWord.imageUrl.isNullOrBlank()) {
                                    AsyncImage(
                                        model = currentWord.imageUrl,
                                        contentDescription = null,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier
                                            .size(130.dp)
                                            .clip(RoundedCornerShape(20.dp))
                                    )
                                }

                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(
                                        text = currentWord.english,
                                        fontSize = 28.sp,
                                        fontWeight = FontWeight.Bold,
                                        fontFamily = FontFamily.Serif
                                    )
                                    Text(
                                        text = currentWord.phonetic,
                                        fontSize = 14.sp,
                                        color = Emerald800,
                                        fontWeight = FontWeight.Medium
                                    )
                                }

                                Text(
                                    text = "اضغط لقلب البطاقة ومعرفة الترجمة 🔄",
                                    fontSize = 11.sp,
                                    color = Stone500
                                )
                            }
                        } else {
                            // Back of card (Arabic Translation)
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .graphicsLayer { rotationY = 180f }
                                    .padding(20.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(text = "الترجمة والمعنى", fontSize = 11.sp, color = Emerald800, fontWeight = FontWeight.Bold)
                                    Text(text = currentWord.category, fontSize = 11.sp, color = Stone400)
                                }

                                Column(
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Text(
                                        text = currentWord.arabic,
                                        fontSize = 32.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    if (!currentWord.exampleEn.isNullOrBlank()) {
                                        Text(
                                            text = "\"${currentWord.exampleEn}\"",
                                            fontSize = 13.sp,
                                            fontFamily = FontFamily.Serif,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                        Text(
                                            text = currentWord.exampleAr ?: "",
                                            fontSize = 11.sp,
                                            color = Stone600
                                        )
                                    }
                                }

                                Button(
                                    onClick = { tts.speakWordWithExplanation(currentWord.english, currentWord.arabic) },
                                    colors = ButtonDefaults.buttonColors(containerColor = Emerald800),
                                    shape = RoundedCornerShape(14.dp)
                                ) {
                                    Icon(imageVector = Icons.Default.VolumeUp, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(text = "استمع للكلمة والشرح", fontSize = 12.sp)
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Next / Prev controls
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedButton(
                            onClick = {
                                if (currentFlashcardIndex > 0) {
                                    currentFlashcardIndex--
                                    isCardFlipped = false
                                }
                            },
                            enabled = currentFlashcardIndex > 0,
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Text(text = "السابقة")
                        }

                        Button(
                            onClick = {
                                if (currentFlashcardIndex < filteredWords.lastIndex) {
                                    currentFlashcardIndex++
                                    isCardFlipped = false
                                }
                            },
                            enabled = currentFlashcardIndex < filteredWords.lastIndex,
                            colors = ButtonDefaults.buttonColors(containerColor = Emerald800),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Text(text = "التالية")
                        }
                    }
                }
            } else {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text(text = "لا توجد كلمات مطابقة للبحث", color = Stone500)
                }
            }
        } else {
            // Standard List View
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                contentPadding = PaddingValues(bottom = 16.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredWords, key = { it.id }) { word ->
                    VocabWordItem(
                        word = word,
                        onToggleFavorite = { onToggleFavorite(word.id) },
                        onDelete = { onDeleteWord(word.id) },
                        tts = tts
                    )
                }
            }
        }
    }
}

@Composable
fun VocabWordItem(
    word: VocabWord,
    onToggleFavorite: () -> Unit,
    onDelete: () -> Unit,
    tts: TextToSpeechHelper
) {
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Word thumbnail or emoji
            if (!word.imageUrl.isNullOrBlank()) {
                AsyncImage(
                    model = word.imageUrl,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(56.dp)
                        .clip(RoundedCornerShape(16.dp))
                )
            } else {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Emerald50),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = word.iconEmoji ?: "📖", fontSize = 26.sp)
                }
            }

            // Word Info
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = word.english,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif
                    )
                    Text(
                        text = word.phonetic,
                        fontSize = 11.sp,
                        color = Emerald800,
                        fontWeight = FontWeight.Medium
                    )
                }
                Text(
                    text = word.arabic,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }

            // Action Buttons
            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                // English Audio
                IconButton(
                    onClick = { tts.speakEnglish(word.english) },
                    modifier = Modifier
                        .size(34.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(Emerald50)
                ) {
                    Icon(
                        imageVector = Icons.Default.VolumeUp,
                        contentDescription = "نطق إنجليزي",
                        tint = Emerald800,
                        modifier = Modifier.size(18.dp)
                    )
                }

                // Bilingual Audio
                IconButton(
                    onClick = { tts.speakWordWithExplanation(word.english, word.arabic) },
                    modifier = Modifier
                        .size(34.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(Stone100)
                ) {
                    Icon(
                        imageVector = Icons.Default.RecordVoiceOver,
                        contentDescription = "نطق وشرح",
                        tint = Emerald800,
                        modifier = Modifier.size(18.dp)
                    )
                }

                // Favorite
                IconButton(
                    onClick = onToggleFavorite,
                    modifier = Modifier.size(34.dp)
                ) {
                    Icon(
                        imageVector = if (word.isFavorite) Icons.Default.Star else Icons.Default.StarBorder,
                        contentDescription = "مفضلة",
                        tint = if (word.isFavorite) Amber500 else Stone400,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}
