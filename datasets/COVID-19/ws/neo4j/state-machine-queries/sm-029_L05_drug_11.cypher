MATCH path = (gene_1:Gene{ iri: $startIri })
  - [enc_1_10:enc] - (protein_10:Protein)
  - [xref_10_10:xref*0..] - (protein_10b:Protein)
  - [cooc_wi_10_11:cooc_wi] - (drug_11:Drug)
RETURN path