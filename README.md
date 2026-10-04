# Frontend for our TLDR-inator
React using Vite

## Run Locally
### Step 1: Install packages
```bash
npm install
```

### Step 2: Build
```bash
npm run build
```

### Step 3: Run 
```bash
npm run dev --host
```

## Using Docker (Recommended)
### Step 1: Build image
```bash
docker build -t `image-name` .
```

### Step 2: Run the container
```bash 
docker run -p 5173:5173 --name `container-name` `image-name`
```

### Test:
[localhost:5173](http://localhost:5173/)

## TODO: 
[ ] Talk isnt working, uncomment the comment code



