import fs from 'fs/promises';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

// Helper function to read config file
const readConfig = async () => {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const defaultConfig = {
        todaySpecial: [],
        homeBanner: {
          title: "",
          description: "",
          imageUrl: "",
          isActive: false
        },
        featuredDishes: [],
        announcementBar: {
          text: "",
          isActive: false
        }
      };
      await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2));
      return defaultConfig;
    }
    throw error;
  }
};

const writeConfig = async (config) => {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
};

export const getConfig = async (req, res) => {
  try {
    const config = await readConfig();
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching configuration",
      error: error.message
    });
  }
};

export const updateTodaySpecial = async (req, res) => {
  try {
    const { dishes } = req.body;
    
    if (!Array.isArray(dishes)) {
      return res.status(400).json({
        success: false,
        message: "Dishes must be an array"
      });
    }

    const config = await readConfig();
    config.todaySpecial = dishes;
    await writeConfig(config);

    res.status(200).json({
      success: true,
      message: "Today's special updated successfully",
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating today's special",
      error: error.message
    });
  }
};

export const updateHomeBanner = async (req, res) => {
  try {
    const { title, description, imageUrl, isActive } = req.body;
    
    const config = await readConfig();
    config.homeBanner = {
      title: title || config.homeBanner.title,
      description: description || config.homeBanner.description,
      imageUrl: imageUrl || config.homeBanner.imageUrl,
      isActive: isActive !== undefined ? isActive : config.homeBanner.isActive
    };
    await writeConfig(config);

    res.status(200).json({
      success: true,
      message: "Home banner updated successfully",
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating home banner",
      error: error.message
    });
  }
};

export const updateFeaturedDishes = async (req, res) => {
  try {
    const { dishes } = req.body;
    
    if (!Array.isArray(dishes)) {
      return res.status(400).json({
        success: false,
        message: "Dishes must be an array"
      });
    }

    const config = await readConfig();
    config.featuredDishes = dishes;
    await writeConfig(config);

    res.status(200).json({
      success: true,
      message: "Featured dishes updated successfully",
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating featured dishes",
      error: error.message
    });
  }
};

export const updateAnnouncementBar = async (req, res) => {
  try {
    const { text, isActive } = req.body;
    
    const config = await readConfig();
    config.announcementBar = {
      text: text || config.announcementBar.text,
      isActive: isActive !== undefined ? isActive : config.announcementBar.isActive
    };
    await writeConfig(config);

    res.status(200).json({
      success: true,
      message: "Announcement bar updated successfully",
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating announcement bar",
      error: error.message
    });
  }
}; 