package com.mahmoudenglish.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahmoudenglish.app.ui.theme.*
import com.mahmoudenglish.app.utils.TextToSpeechHelper

data class IslamicItem(
    val arabic: String,
    val english: String,
    val transliteration: String,
    val meaningAr: String
)

@Composable
fun IslamicCornerScreen(
    tts: TextToSpeechHelper,
    onBack: () -> Unit
) {
    val items = listOf(
        IslamicItem(
            arabic = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
            english = "In the name of Allah, the Most Gracious, the Most Merciful",
            transliteration = "Bismillah ir-Rahman ir-Rahim",
            meaningAr = "نبدأ بها كل عمل صالح لنيل البركة"
        ),
        IslamicItem(
            arabic = "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
            english = "Praise be to Allah, Lord of the worlds",
            transliteration = "Al-hamdu lillahi Rabbil-'alamin",
            meaningAr = "الشكر والثناء لله تعالى على نعمه التي لا تُحصى"
        ),
        IslamicItem(
            arabic = "رَبِّ زِدْنِي عِلْمًا",
            english = "My Lord, increase me in knowledge",
            transliteration = "Rabbi Zidni 'Ilma",
            meaningAr = "دعاء قرآني لطلب العلم والتوفيق في الدراسة"
        ),
        IslamicItem(
            arabic = "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
            english = "Glory be to Allah and praise Him",
            transliteration = "Subhan Allahi wa bihamdihi",
            meaningAr = "تسبيح عظيم الأجر وخفيف على اللسان ثقيل في الميزان"
        ),
        IslamicItem(
            arabic = "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
            english = "There is no power and no strength except with Allah",
            transliteration = "La hawla wa la quwwata illa billah",
            meaningAr = "كنز من كنوز الجنة واعتراف بالعجز إلا بعون الله"
        ),
        IslamicItem(
            arabic = "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا",
            english = "O Allah, there is no ease except that which You have made easy",
            transliteration = "Allahumma la sahla illa ma ja'altahu sahla",
            meaningAr = "دعاء تيسير الأمور الصعبة والامتحانات"
        ),
        IslamicItem(
            arabic = "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
            english = "Peace and mercy and blessings of Allah be upon you",
            transliteration = "As-salamu alaykum wa rahmatullahi wa barakatuh",
            meaningAr = "تحية الإسلام التي تبث المحبة والسلام"
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "رجوع",
                        tint = MaterialTheme.colorScheme.onSurface
                    )
                }

                Column {
                    Text(
                        text = "الركن الإسلامي الإنجليزي",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Serif,
                        color = Emerald800
                    )
                    Text(
                        text = "أدعية ومصطلحات إسلامية بالإنجليزية مع النطق",
                        fontSize = 11.sp,
                        color = Stone500
                    )
                }
            }

            Icon(
                imageVector = Icons.Default.NightlightRound,
                contentDescription = null,
                tint = Amber500,
                modifier = Modifier.size(26.dp)
            )
        }

        // List of Islamic Items
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            contentPadding = PaddingValues(bottom = 80.dp)
        ) {
            items(items) { item ->
                Surface(
                    shape = RoundedCornerShape(18.dp),
                    color = MaterialTheme.colorScheme.surface,
                    tonalElevation = 2.dp,
                    shadowElevation = 3.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        // Top row: Arabic & Audio button
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = item.arabic,
                                fontSize = 17.sp,
                                fontWeight = FontWeight.Bold,
                                color = Emerald800
                            )

                            IconButton(
                                onClick = {
                                    tts.speakWordWithExplanation(
                                        item.english,
                                        item.meaningAr
                                    )
                                },
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(Emerald100)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.VolumeUp,
                                    contentDescription = "استماع",
                                    tint = Emerald800,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }

                        // English translation
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(
                                modifier = Modifier.padding(10.dp),
                                verticalArrangement = Arrangement.spacedBy(2.dp)
                            ) {
                                Text(
                                    text = item.english,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Text(
                                    text = item.transliteration,
                                    fontSize = 11.sp,
                                    color = Stone500
                                )
                            }
                        }

                        // Meaning in Arabic
                        Text(
                            text = "• ${item.meaningAr}",
                            fontSize = 11.sp,
                            color = Stone600
                        )
                    }
                }
            }
        }
    }
}
