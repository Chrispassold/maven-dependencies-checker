# 🔍 Maven Dependencies Checker

A powerful web-based tool for extracting and comparing Maven dependencies from Maven Repository. Built with modern web technologies, this tool helps developers analyze dependency changes between different versions of Maven artifacts.

## 🌐 Live Demo

**Try it now:** [Demo](https://chrispassold.github.io/maven-dependencies-checker/)

---

## ✨ Features

### 🔍 Dependency Extraction
- **URL-based extraction**: Simply paste a Maven Repository URL to extract all dependencies
- **Automatic parsing**: Extracts Group/Artifact and Version information from Maven Repository pages
- **JSON output**: Generates clean, structured JSON for easy integration
- **Real-time validation**: Validates Maven Repository URLs before processing

### 🔄 Dependency Comparison
- **Side-by-side comparison**: Compare two JSON dependency sets
- **Smart version analysis**: Automatically detects version changes (updates, downgrades, equal)
- **Visual indicators**: Color-coded results for easy identification
- **Comprehensive filtering**: Filter results by change type and version direction

### 🎛️ Advanced Filtering
- **Change type filters**: Show/hide additions, removals, and modifications
- **Version direction filters**: Filter by updates, downgrades, or equal versions
- **Quick actions**: Predefined filter combinations for common use cases
- **Active filter display**: See which filters are currently applied

### 📊 Rich Results Display
- **Statistics summary**: Overview of changes with counts
- **Detailed tables**: Organized display of all changes
- **Color-coded badges**: Visual indicators for different change types
- **Responsive design**: Works perfectly on desktop and mobile devices

## 🚀 How to Use

### 1. Extract Dependencies

1. **Open the application** in your web browser
2. **Paste a Maven Repository URL** in the search field
   - Example: `https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web/3.2.5`
3. **Click "Search"** or press Enter
4. **Copy the generated JSON** using the copy buttons

### 2. Compare Dependencies

1. **Paste JSON data** into the "Old JSON" and "New JSON" fields
2. **Configure filters** to show/hide specific types of changes
3. **Click "Compare Versions"** to analyze the differences
4. **Review the results** in the detailed comparison tables

### 3. Filter Results

Use the advanced filtering options to focus on specific changes:

- **Change Type**:
  - ✅ Additions
  - ❌ Removals
  - 🔄 Modifications
  - 🔍 Only Existing

- **Version Filters**:
  - ⬆️ Update (Version upgrades)
  - ⬇️ Downgrade (Version downgrades)
  - ⚖️ Equal (Equal versions)

### 4. Quick Actions

- **Select All**: Enable all filters
- **Deselect All**: Disable all filters
- **Only Changes**: Show only actual changes (hide equal versions)

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic markup and structure
- **Tailwind CSS**: Modern, utility-first CSS framework
- **Alpine.js**: Lightweight JavaScript framework for reactivity
- **Font Awesome**: Beautiful icons for enhanced UX

### Key Features
- **No backend required**: Pure client-side application
- **CORS proxy**: Uses `api.allorigins.win` to bypass CORS restrictions
- **Responsive design**: Works on all device sizes
- **Real-time validation**: Instant feedback on user inputs
- **Smooth animations**: Enhanced user experience with transitions

### Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 📋 Example Usage

### Step 1: Extract Dependencies
```
URL: https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web/3.2.5
```

Generated JSON:
```json
{
  "org.springframework:spring-core": "6.1.3",
  "org.springframework:spring-web": "6.1.3",
  "org.springframework:spring-webmvc": "6.1.3",
  "org.springframework.boot:spring-boot": "3.2.5",
  "org.springframework.boot:spring-boot-autoconfigure": "3.2.5"
}
```

### Step 2: Compare Versions
Compare two different versions of the same artifact to see dependency changes:

**Version 3.2.5 vs 3.1.0**:
- ✅ New dependencies added
- ❌ Some dependencies removed
- 🔄 Version updates for existing dependencies

## 🎯 Use Cases

### For Developers
- **Dependency analysis**: Understand what changed between versions
- **Migration planning**: Plan upgrades by seeing what dependencies are affected
- **Security audits**: Identify new or removed dependencies
- **Compatibility checks**: Ensure all required dependencies are present

### For DevOps
- **Deployment planning**: Understand impact of dependency changes
- **Rollback analysis**: Compare current vs previous versions
- **Monitoring**: Track dependency evolution over time

### For Project Managers
- **Change impact assessment**: Understand scope of dependency updates
- **Risk evaluation**: Identify potential breaking changes
- **Timeline planning**: Estimate effort for dependency updates

## 🔧 Development

### Local Setup
1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required!

### Project Structure
```
maven-dependencies-checker/
├── index.html          # Main application file
├── generateDependenciesJson.kts  # Kotlin script (if applicable)
└── README.md          # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Keep the application lightweight and fast
- Maintain responsive design principles
- Add comprehensive error handling
- Follow modern JavaScript best practices

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Christian Passold** - [GitHub Profile](https://github.com/Chrispassold)

---

⭐ **Star this repository if you find it useful!**

---

*Built with ❤️ for the Maven community*