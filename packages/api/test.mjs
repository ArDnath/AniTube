import { animeApi } from "./dist/index.js";

async function test() {
  try {
    console.log("🎬 Testing AniTube API...\n");

    // Test 1: Search
    console.log('1️⃣  Searching for "Naruto"...');
    const searchResults = await animeApi.searchAnime("Naruto", { perPage: 5 });
    console.log(`   ✓ Found ${searchResults.data.length} results`);
    if (searchResults.data[0]) {
      console.log(
        `   ✓ First result: ${searchResults.data[0].title.english || searchResults.data[0].title.romaji}`,
      );
    }
    console.log();

    // Test 2: Get trending
    console.log("2️⃣  Getting trending anime...");
    const trending = await animeApi.getTrending(1, 5);
    console.log(`   ✓ Trending anime (${trending.data.length} results):`);
    trending.data.forEach((anime, i) => {
      console.log(
        `      ${i + 1}. ${anime.title.english || anime.title.romaji} (Score: ${anime.averageScore || "N/A"})`,
      );
    });
    console.log();

    // Test 3: Get anime details
    console.log("3️⃣  Getting anime details (AniList ID: 1)...");
    const anime = await animeApi.getAnimeById(1);
    console.log(`   ✓ Title: ${anime.title.english || anime.title.romaji}`);
    console.log(`   ✓ Score: ${anime.averageScore}/100`);
    console.log(`   ✓ Genres: ${anime.genres.join(", ")}`);
    console.log(`   ✓ Episodes: ${anime.episodes || "Unknown"}`);
    console.log(`   ✓ Status: ${anime.status}`);
    console.log();

    // Test 4: Get popular anime
    console.log("4️⃣  Getting popular anime...");
    const popular = await animeApi.getPopular(1, 3);
    console.log(`   ✓ Popular anime (${popular.data.length} results):`);
    popular.data.forEach((anime, i) => {
      console.log(
        `      ${i + 1}. ${anime.title.english || anime.title.romaji}`,
      );
    });
    console.log();

    // Test 5: Get current season
    console.log("5️⃣  Getting current season anime...");
    const currentSeason = await animeApi.getCurrentSeason(1, 3);
    console.log(
      `   ✓ Current season anime (${currentSeason.data.length} results):`,
    );
    currentSeason.data.forEach((anime, i) => {
      console.log(
        `      ${i + 1}. ${anime.title.english || anime.title.romaji}`,
      );
    });
    console.log();

    console.log("✅ All tests passed!\n");
    console.log("🎉 Your AniTube API is working perfectly!");
  } catch (error) {
    console.error("\n❌ Error occurred:", error.message);
    if (error.statusCode) {
      console.error(`   Status Code: ${error.statusCode}`);
    }
    if (error.provider) {
      console.error(`   Provider: ${error.provider}`);
    }
    console.error(
      "\n💡 Tip: Make sure the API services are accessible and you have internet connection.",
    );
    process.exit(1);
  }
}

test();
