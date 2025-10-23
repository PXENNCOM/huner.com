// Bu dosya, projelerde kullanılacak teknolojilerin listesini içerir.
// react-select bileşeni bu veriyi kullanarak seçenekleri gruplandırır.

export const technologyOptions = [
  {
    label: 'Programlama Dilleri',
    options: [
      { value: 'python', label: 'Python' },
      { value: 'r', label: 'R' },
      { value: 'sql', label: 'SQL' },
      { value: 'java', label: 'Java' },
      { value: 'scala', label: 'Scala' },
      { value: 'c++', label: 'C++' },
      { value: 'julia', label: 'Julia' },
    ],
  },
  {
    label: 'Veri Manipülasyonu ve Analizi',
    options: [
      { value: 'pandas', label: 'Pandas' },
      { value: 'numpy', label: 'NumPy' },
      { value: 'dask', label: 'Dask' },
      { value: 'vaex', label: 'Vaex' },
    ],
  },
  {
    label: 'Veri Görselleştirme',
    options: [
      { value: 'matplotlib', label: 'Matplotlib' },
      { value: 'seaborn', label: 'Seaborn' },
      { value: 'plotly', label: 'Plotly' },
      { value: 'bokeh', label: 'Bokeh' },
      { value: 'streamlit', label: 'Streamlit' },
      { value: 'gradio', label: 'Gradio' },
    ],
  },
  {
    label: 'Makine Öğrenmesi (Genel)',
    options: [
      { value: 'scikit-learn', label: 'Scikit-learn' },
      { value: 'xgboost', label: 'XGBoost' },
      { value: 'lightgbm', label: 'LightGBM' },
      { value: 'catboost', label: 'CatBoost' },
      { value: 'statsmodels', label: 'Statsmodels' },
    ],
  },
  {
    label: 'Derin Öğrenme',
    options: [
      { value: 'tensorflow', label: 'TensorFlow' },
      { value: 'pytorch', label: 'PyTorch' },
      { value: 'keras', label: 'Keras' },
      { value: 'hugging-face-transformers', label: 'Hugging Face Transformers' },
      { value: 'opencv', label: 'OpenCV' },
    ],
  },
  {
    label: 'Büyük Veri Teknolojileri',
    options: [
        { value: 'apache-spark', label: 'Apache Spark' },
        { value: 'apache-hadoop', label: 'Apache Hadoop' },
        { value: 'apache-kafka', label: 'Apache Kafka' },
        { value: 'databricks', label: 'Databricks' },
    ],
  },
  {
    label: 'Bulut Platformları ve Servisleri',
    options: [
        { value: 'aws-sagemaker', label: 'AWS SageMaker' },
        { value: 'google-vertex-ai', label: 'Google Vertex AI' },
        { value: 'azure-ml', label: 'Azure Machine Learning' },
        { value: 'aws-s3', label: 'AWS S3' },
        { value: 'google-cloud-storage', label: 'Google Cloud Storage' },
        { value: 'bigquery', label: 'BigQuery' },
    ],
  },
  {
    label: 'MLOps ve Geliştirme Araçları',
    options: [
        { value: 'git', label: 'Git' },
        { value: 'docker', label: 'Docker' },
        { value: 'kubernetes', label: 'Kubernetes' },
        { value: 'mlflow', label: 'MLflow' },
        { value: 'weights-and-biases', label: 'Weights & Biases (W&B)' },
        { value: 'jupyter-notebook', label: 'Jupyter Notebook' },
    ],
  }
];